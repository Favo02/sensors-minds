# rpimqtt
Simple mqtt client to publish sensors data.

## Important note about SNI

Some cloud providers (e.g. AWS) require that SNI be enabled on the client.  There does not appear to be a way to configure lwip's MQTT app client to set up SNI. This code uses a patched version of `mqtt.c` to support SNI.

If you want to connect to a cloud provider that requires SNI you'll need to apply the patch to the copy of LWIP thats used by the Pico SDK.

To do so, in your expansion of `pico-sdk`, run

```bash
cd lib/lwip
git apply path/to/mqtt-sni.patch
```

Then, re-build your application making sure it uses your patched changes.

## Setup

### pico-sdk

You should just need to set up pico-sdk as you would for pico-examples.

### cmake

Configure cmake with the following variables, the same as pico-examples.
- PICO_SDK_PATH
- PICO_BOARD
- WIFI_SSID
- WIFI_PASSWORD

### build 

```mkdir build
   cmake .. -DPICO_BOARD=pico_w -DWIFI_SSID=<SSID> -DWIFI_PASSWORD=<PWD> -DSERVER_HOST=<MQTT_HOST> -DSERVER_PORT=<MQTT_PORT>
```

### (IF SSL/TLS IS NECESSARY) crypto_consts.h custom header

The build relies on a simple header file (crypto_consts.h) to provide cryptographic keys and certificates as well.

See crytpo_consts_example.h for a setup for AWS IoT and Mosquitto test servers.
