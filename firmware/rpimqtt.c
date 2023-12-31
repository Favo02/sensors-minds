#ifndef PICO_STDIO_USB_CONNECT_WAIT_TIMEOUT_MS
#define PICO_STDIO_USB_CONNECT_WAIT_TIMEOUT_MS (500)
#endif

#include <stdio.h>
#include <string.h>
#include <time.h>

#include "dht/include/dht.h"
#include "hardware/structs/rosc.h"
#include "lwip/altcp_tcp.h"
#include "lwip/altcp_tls.h"
#include "lwip/apps/mqtt.h"
#include "lwip/apps/mqtt_priv.h"
#include "lwip/dns.h"
#include "lwip/pbuf.h"
#include "lwip/tcp.h"
#include "pico/cyw43_arch.h"
#include "pico/stdlib.h"

// #include "tusb.h"
#define DEBUG_printf printf

#define MQTT_TLS \
  0  // needs to be 1 for AWS IoT. Also set published QoS to 0 or 1
// #define CRYPTO_MOSQUITTO_LOCAL
// It is possible to activatet MQTT TLS ENCRYPTION BUT IT REQUIRE THE SERVER NAME INDICATION PATCH (mqtt-sni.patch)
#if MQTT_TLS
#ifdef CRYPTO_CERT
const char *cert = CRYPTO_CERT;
#endif
#ifdef CRYPTO_CA
const char *ca = CRYPTO_CA;
#endif
#ifdef CRYPTO_KEY
const char *key = CRYPTO_KEY;
#endif
#endif

static const dht_model_t DHT_MODEL = DHT11;
static const uint DATA_PIN = 15; 
static const uint LED_PIN = CYW43_WL_GPIO_LED_PIN; // PICO-W has the ONBOARD LED connected to the wifi Radio

typedef struct MQTT_CLIENT_T_ {
  ip_addr_t remote_addr;
  mqtt_client_t *mqtt_client;
  u32_t received;
  u32_t counter;
  u32_t reconnect;
} MQTT_CLIENT_T;

dht_t dht;
err_t mqtt_test_connect(MQTT_CLIENT_T *state);


void nullFunc() {};
// Perform initialisation
static MQTT_CLIENT_T *mqtt_client_init(void) {
  MQTT_CLIENT_T *state = calloc(1, sizeof(MQTT_CLIENT_T));
  if (!state) {
    DEBUG_printf("failed to allocate state\n");
    return NULL;
  }
  state->received = 0;
  return state;
}

void dns_found(const char *name, const ip_addr_t *ipaddr, void *callback_arg) {
  MQTT_CLIENT_T *state = (MQTT_CLIENT_T *)callback_arg;
  DEBUG_printf("DNS query finished with resolved addr of %s.\n",
               ip4addr_ntoa(ipaddr));
  state->remote_addr = *ipaddr;
}

void run_dns_lookup(MQTT_CLIENT_T *state) {
  DEBUG_printf("Running DNS query for %s.\n", SERVER_HOST);

  cyw43_arch_lwip_begin();
  err_t err =
      dns_gethostbyname(SERVER_HOST, &(state->remote_addr), dns_found, state);
  cyw43_arch_lwip_end();

  if (err == ERR_ARG) {
    DEBUG_printf("failed to start DNS query\n");
    return;
  }

  if (err == ERR_OK) {
    DEBUG_printf("no lookup needed");
    return;
  }

  while (state->remote_addr.addr == 0) {
    cyw43_arch_poll();
    sleep_ms(1);
  }
}

u32_t data_in = 0;

u8_t buffer[1025];
u8_t data_len = 0;

static void mqtt_pub_start_cb(void *arg, const char *topic, u32_t tot_len) {
  DEBUG_printf("mqtt_pub_start_cb: topic %s\n", topic);

  if (tot_len > 1024) {
    DEBUG_printf("Message length exceeds buffer size, discarding");
  } else {
    data_in = tot_len;
    data_len = 0;
  }
}

static void mqtt_pub_data_cb(void *arg, const u8_t *data, u16_t len,
                             u8_t flags) {
  if (data_in > 0) {
    data_in -= len;
    memcpy(&buffer[data_len], data, len);
    data_len += len;

    if (data_in == 0) {
      buffer[data_len] = 0;
      DEBUG_printf("Message received: %s\n", &buffer);
    }
  }
}

static void mqtt_connection_cb(mqtt_client_t *client, void *arg,
                               mqtt_connection_status_t status) {
  if (status != 0) {
    DEBUG_printf("Error during connection: err %d.\n", status);
  } else {
    DEBUG_printf("MQTT connected.\n");
  }
}

void mqtt_pub_request_cb(void *arg, err_t err) {
  MQTT_CLIENT_T *state = (MQTT_CLIENT_T *)arg;
  DEBUG_printf("mqtt_pub_request_cb: err %d\n", err);
  state->received++;
}

void mqtt_sub_request_cb(void *arg, err_t err) {
  DEBUG_printf("mqtt_sub_request_cb: err %d\n", err);
}

err_t mqtt_pubblish_easy(MQTT_CLIENT_T *state, const char *topic,
                         const void *payload, u8_t qos, u8_t retain) {
  err_t err;
  cyw43_arch_lwip_begin();
  err = mqtt_publish(state->mqtt_client, topic, payload, strlen(payload), qos,
                     retain, (void(*)) nullFunc, state);
  cyw43_arch_lwip_end();
  if (err != ERR_OK && cyw43_wifi_link_status(&cyw43_state, CYW43_ITF_STA) == CYW43_LINK_JOIN) {
    DEBUG_printf("Publish err: %d\n", err);
  }
  return err;
}

err_t mqtt_publish_sensors(MQTT_CLIENT_T *state) {
  char tempBuffer[128];
  char humidityBuffer[128];
  dht_start_measurement(&dht);

  float humidity;
  float temperature_c;
  dht_result_t result =
      dht_finish_measurement_blocking(&dht, &humidity, &temperature_c);
  if (result == DHT_RESULT_OK) {
    sprintf(tempBuffer, "{\"temp\":%.1f}", temperature_c);
    sprintf(humidityBuffer, "{\"humidity\":%.1f}", humidity);
    // printf("%.1f C (%.1f F), %.1f%% humidity\n", temperature_c,
    //        celsius_to_fahrenheit(temperature_c), humidity);
  } else if (result == DHT_RESULT_TIMEOUT) {
    DEBUG_printf("{\"message\":\"%s\"}",
                 "DHT sensor not responding. Please check your wiring.");
  } else {
    assert(result == DHT_RESULT_BAD_CHECKSUM);
    DEBUG_printf("{\"message\":\"%s\"}", "Bad checksum.");
  }

  err_t err;
  u8_t qos =
      0; /* 0 1 or 2, see MQTT specification.  AWS IoT does not support QoS 2 */
  u8_t retain = 0;
  err = mqtt_pubblish_easy(state, "temp/tempsensor1", tempBuffer, qos,
                           retain);
  err = mqtt_pubblish_easy(state, "humidity/humiditysensor1", humidityBuffer,
                           qos, retain);

  return err;
}

err_t mqtt_test_connect(MQTT_CLIENT_T *state) {
  struct mqtt_connect_client_info_t ci;
  err_t err;

  memset(&ci, 0, sizeof(ci));

  ci.client_id = "RPIMQTT";
  ci.client_user = NULL;
  ci.client_pass = NULL;
  ci.keep_alive = 0;
  ci.will_topic = NULL;
  ci.will_msg = NULL;
  ci.will_retain = 0;
  ci.will_qos = 0;

  const struct mqtt_connect_client_info_t *client_info = &ci;

  err = mqtt_client_connect(state->mqtt_client, &(state->remote_addr),
                            atoi(SERVER_PORT), mqtt_connection_cb, state,
                            client_info);

  if (err != ERR_OK) {
    DEBUG_printf("mqtt_connect return %d\n", err);
  }

  return err;
}
void connect_to_wifi() {
  while (cyw43_wifi_link_status(&cyw43_state, CYW43_ITF_STA) != CYW43_LINK_JOIN) {
    DEBUG_printf("Connecting to WiFi...\n");
    if (cyw43_arch_wifi_connect_timeout_ms(WIFI_SSID, WIFI_PASSWORD,
                                           CYW43_AUTH_WPA2_AES_PSK, 30000)) {
      DEBUG_printf("failed to  connect.\n");
      cyw43_arch_gpio_put(LED_PIN, 1);
    } else {
      DEBUG_printf("Connected.\n");
      cyw43_arch_gpio_put(LED_PIN, 0);

    }
  } 
}
void mqtt_run_test(MQTT_CLIENT_T *state) {
  state->mqtt_client = mqtt_client_new();

  state->counter = 0;

  if (state->mqtt_client == NULL) {
    DEBUG_printf("Failed to create new mqtt client\n");
    return;
  }
  // psa_crypto_init();
  if (mqtt_test_connect(state) == ERR_OK) {
    absolute_time_t timeout = nil_time;
    mqtt_set_inpub_callback(state->mqtt_client, mqtt_pub_start_cb,
                            mqtt_pub_data_cb, 0);

    while (true) {
      cyw43_arch_poll();
      absolute_time_t now = get_absolute_time();
      if (is_nil_time(timeout) || absolute_time_diff_us(now, timeout) <= 0) {
        if (mqtt_client_is_connected(state->mqtt_client)) {
          cyw43_arch_lwip_begin();

          //   if (!subscribed) {
          //     mqtt_sub_unsub(state->mqtt_client, "temp1/status/switch:0", 0,
          //                    mqtt_sub_request_cb, 0, 1);
          //     subscribed = true;
          //   }

          if (mqtt_publish_sensors(state) == ERR_OK) {
            if (state->counter != 0) {
              DEBUG_printf("published %d\n", state->counter);
            }
            timeout = make_timeout_time_ms(5000);
            state->counter++;
          }  // else ringbuffer is full and we need to wait for messages to
             // flush.
          cyw43_arch_lwip_end();
        } else {
          connect_to_wifi();
          // DEBUG_printf(".");
        }
      }
    }
  }
}

int main() {
  stdio_init_all();

  dht_init(&dht, DHT_MODEL, pio0, DATA_PIN, true /* pull_up */);

  if (cyw43_arch_init()) {
    DEBUG_printf("failed to initialise\n");
    return 1;
  }
  cyw43_arch_enable_sta_mode();

  gpio_init(LED_PIN);
  gpio_set_dir(LED_PIN, GPIO_OUT);

  connect_to_wifi();

  MQTT_CLIENT_T *state = mqtt_client_init();

  run_dns_lookup(state);

  mqtt_run_test(state);

  cyw43_arch_deinit();
  return 0;
}