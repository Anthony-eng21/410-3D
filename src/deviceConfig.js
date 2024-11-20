import * as THREE from "three";

export const deviceConfigurations = {
  410: {
    modelPath: "/models/Devices/ControlByWeb_1.glb",
    initialCameraPosition: new THREE.Vector3(-0.3, 0.72, 1.3),
    name: "X-410",
    description: "Web-Enabled Control Module",
    annotationPoints: [
      {
        position: new THREE.Vector3(-0.14, 0.25, 0.35),
        name: "1",
        heading: "4 Relays",
        description: "Single Pull, Single Throw, 1 Amp, Shared Common",
        popupDirection: "leftPopup",
        newCameraXOffset: 1,
        mobileNewCameraXOffset: -15,
        sidebar: {
          sidebarHeading: "X-410™ <br />Relays",
          specsHeading: "Specifications",
          subHeading:
            "Four general purpose relays ideal for a variety of industrial and commercial uses, including HVAC, access control, rebooting, and more.",
          specs: [
            { label: "Max Voltage: ", value: "28VAC, 24VDC" },
            {
              label: "Max Current: ",
              value: "1A, shared common (0.25A when all relays are on)",
            },
            {
              label: "Contact Type: ",
              value: "SPST (Form A) All Relays have a shared common",
            },
            { label: "Load Type: ", value: "Load Type: General Purpose" },
            { label: "Relay Models: ", value: "ON/OFF, Pulsed, Toggle" },
            {
              label: "Pulse Timer Duration: ",
              value: "0.1 to 86,400 Seconds (1-day)",
            },
          ],
          details: {
            title: "Control Features",
            description: "",
            features: [
              "Browser-based GUI dashboard",
              "On-board no-code logic",
              "REST API, MQTT, Modbus, SNMP",
              "Conditional and Scheduled logic",
              "P2P I/O sharing with CBW devices",
              "Auto-Reboot/Watchdog protocol",
            ],
          },
        },
      },
      {
        position: new THREE.Vector3(-0.14, 0.07, 0.35),
        name: "2",
        heading: "4 Digital Inputs",
        description: "Normally Open, Optically-Isolated",
        mobileNewCameraXOffset: -15,
        popupDirection: "leftPopup",
        newCameraXOffset: 1,
        newCameraYOffset: 50,
        sidebar: {
          sidebarHeading: "X-410™ <br />Digital Inputs",
          specsHeading: "Specifications",
          subHeading:
            "Four general purpose digital inputs perfect for dry contact monitoring, alarm panel monitoring, switch and button inputs, etc.",
          specs: [
            { label: "Type: ", value: "Optically-Isolated" },
            { label: "Voltage Range: ", value: "4-26VDC" },
            { label: "Current: ", value: "950uA @ 4V, 8.5mA @ 26V" },
            { label: "Minimum Hold Time: ", value: "20ms" },
            {
              label: "Max Count Rate: ",
              value: "200Hz Max (Dependent on Configuration)",
            },
          ],
          details: {
            title: "Input Functions",
            description: "",
            features: [
              "Monitor State",
              "Control Local and Remote Relays",
              "Scalable Counter",
              "On Timer, Total On Timer",
              "Frequency",
              "Email Alerts",
              "MQTT Publications",
              "SNMP Traps",
            ],
          },
        },
      },
      {
        position: new THREE.Vector3(-0.035, -0.1, 0.35),
        name: "3",
        heading: "1-Wire Bus",
        description: "Up to 16 Temperature Sensors",
        popupDirection: "leftPopup",
        newCameraYOffset: 50,
        newCameraXOffset: 1,
        sidebar: {
          sidebarHeading: "X-410™ <br />1-Wire Bus",
          specsHeading: "Specifications",
          subHeading:
            "Connect up to 16 temperature sensors for general purpose temperature monitoring. Connect up to 8 Temp/Humidity probes.",
          specs: [
            {
              label: "Type: ",
              value: "Digital 1-Wire (Maxim Semiconductor DS18B20)",
            },
            {
              label: "Temperature Range: ",
              value: "-67°F to 257°F (-55°C to +125°C)",
            },
            { label: "Accuracy: ", value: "±0.5°C (from -10°C to +85°C)" },
            {
              label: "Humidity Type: ",
              value:
                "ControlByWeb Model <a style='color:#f0f0f0f0;' href='https://controlbyweb.com/accessories/temperature-humidity-sensor/'>X-DTHS-P sensor</a>",
            },
            { label: "Humidity Range: ", value: "0-100% RH (non-condensing)" },
            { label: "Accuracy: ", value: "±2%" },
            {
              label: "Max Cable Length: ",
              value: "600 feet (180m) maximum combined cable length",
            },
          ],
          details: {
            title: "Sensors Functions",
            description: "",
            features: [
              "Monitor Temperature",
              "Log Temperature",
              "Email Alerts",
              "MQTT Publications",
              "SNMP Traps",
            ],
          },
        },
      },
      {
        position: new THREE.Vector3(-0.035, -0.19, 0.35),
        name: "4",
        heading: "Networking",
        description: "Ethernet, WiFi, and Cellular Options",
        popupDirection: "leftPopup",
        newCameraYOffset: 30,
        newCameraXOffset: 1,
        sidebar: {
          sidebarHeading: "X-410™ <br />Networking Options",
          specsHeading: "Specifications",
          subHeading: "Multiple networking options with failover for each",
          specs: [
            { label: "Type: ", value: "10/100 Base-T Ethernet Port" },
            {
              label: "Setup: ",
              value: "Static or DHCP IP address configuration",
            },
            {
              label: "Wireless: ",
              value: "WiFi Communication (X-410W model only)",
            },
            { label: "Network Standards: ", value: "IEEE 802.11 b/g/n" },
            { label: "Frequency Band: ", value: "2.412 – 2.462 GHz" },
            {
              label: "Wi-Fi Security Standards: ",
              value: "Wi-Fi Security Standards: WPA2, WPA3",
            },
            {
              label: "Cellular: ",
              value: "Cellular Modem (X-410CW model only)",
            },
            { label: "Cellular Connector: ", value: "Male SMA Connector" },
          ],
          details: {
            title: "X-410™<br /> Networking Options",
            description: "Multiple networking options with failover for each",
            features: [
              "X-410CW-I: Cellular, WiFi, and Ethernet",
              "X-410W-I: WiFi and Ethernet",
              "X-410-I: Ethernet Only",
              "X-410-E: Ethernet Only, with POE",
            ],
          },
        },
      },
      {
        position: new THREE.Vector3(0.055, 0.32, 0.43),
        name: "5",
        heading: "Power Supply",
        description: "9-28VDC and/or POE",
        popupDirection: "rightPopup",
        newCameraXOffset: 7,
        sidebar: {
          sidebarHeading: "X-410™ <br />Power Supply",
          specsHeading: "Specifications",
          subHeading: "",
          specs: [
            { label: "Max Current: ", value: "240mA" },
            { label: "POE: ", value: "48V, 802.3af, Class 1" },
          ],
          details: {
            title: "Power Supply",
            description: "",
            features: [
              "9-28VDC and/or POE (not included)",
              "POE only available with model X-410-E",
            ],
          },
        },
      },
      {
        position: new THREE.Vector3(-0.15, 0.425, -0.44),
        name: "6",
        heading: "Mounting Options",
        description: "DIN Rail and Surface Mount",
        popupDirection: "rightPopup",
        newCameraXOffset: -35,
        sidebar: {
          sidebarHeading: "",
          specsHeading: "Physical Specifications",
          subHeading: "",
          specs: [
            { label: "Operating Temperature: ", value: "-40°F to 150°F (-40°C to 65.5°C)" },
            { label: "Width: ", value: "1.41in (35.7mm)" },
            { label: "Height: ", value: "3.88in (98.5mm)" },
            { label: "Depth: ", value: "3.1in of depth (78mm) (not including connector)" },
            { label: "Weight: ", value: "5 oz (142 grams)" },
            { label: "Enclosure Material" , value: "Lexan 940 Polycarbonate Plastic" },
            { label: "Enclosure Flame Rating: ", value: "UL94 V0" },
          ],
          details: {
            title: "Detail Section 5",
            description: "",
            features: [
              "Feature one lorem ipsum",
              "Feature two dolor sit",
              "Feature three amet",
              "Feature four consectetur",
              "Feature five adipiscing",
            ],
          },
        },
      },
    ],
  },
  // add more device configurations here
};
