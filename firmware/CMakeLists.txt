cmake_minimum_required(VERSION 3.12)

# Pull in SDK (must be before project)
include(pico_sdk_import.cmake)

project(pico_examples C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

if (PICO_SDK_VERSION_STRING VERSION_LESS "1.3.0")
    message(FATAL_ERROR "Raspberry Pi Pico SDK version 1.3.0 (or later) required. Your version is ${PICO_SDK_VERSION_STRING}")
endif()

# Initialize the SDK
pico_sdk_init()

add_compile_options(-Wall
        -Wno-format          # int != int32_t as far as the compiler is concerned because gcc has int32_t as long int
        -Wno-unused-function # we have some for the docs that aren't called
        -Wno-maybe-uninitialized
        )

if (PICO_CYW43_SUPPORTED) # set by -DPICO_BOARD=pico_w
    if (NOT TARGET pico_cyw43_arch)
        message("Skipping build as support is not available")
    else()
        set(WIFI_SSID "${WIFI_SSID}" CACHE INTERNAL "WiFi SSID")
        set(WIFI_PASSWORD "${WIFI_PASSWORD}" CACHE INTERNAL "WiFi password")
        set(SERVER_HOST "${SERVER_HOST}" CACHE INTERNAL "Server Host")
        set(SERVER_PORT "${SERVER_PORT}" CACHE INTERNAL "Server Port")

        add_subdirectory(dht)
        add_executable(rpimqtt
            rpimqtt.c
        )
       
        # disable usb and uart output
        pico_enable_stdio_usb(rpimqtt 1)
        pico_enable_stdio_uart(rpimqtt 0)

        target_compile_definitions(rpimqtt PRIVATE
        WIFI_SSID=\"${WIFI_SSID}\"
        WIFI_PASSWORD=\"${WIFI_PASSWORD}\"
        SERVER_HOST=\"${SERVER_HOST}\"
        SERVER_PORT=\"${SERVER_PORT}\"
        #TEST_TCP_SERVER_IP=\"${TEST_TCP_SERVER_IP}\"
        NO_SYS=1
        )

        target_include_directories(rpimqtt PRIVATE
            ${CMAKE_CURRENT_LIST_DIR}
            #${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
        )

        target_link_libraries(rpimqtt
            dht
            pico_cyw43_arch_lwip_poll
            pico_stdlib
            pico_lwip_mbedtls
            pico_mbedtls
            pico_lwip_mqtt
        )

        pico_add_extra_outputs(rpimqtt)
    endif()
endif()

