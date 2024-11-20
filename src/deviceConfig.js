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
        heading: "HEADING 3",
        description:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.",
        popupDirection: "leftPopup",
        newCameraYOffset: 50,
        newCameraXOffset: 1,
        sidebar: {
          sidebarHeading: "",
          specsHeading: "Specifications",
          subHeading: "",
          specs: [
            { label: "Spec 1", value: "Value 1" },
            { label: "Spec 2", value: "Value 2" },
            { label: "Spec 3", value: "Value 3" },
            { label: "Spec 4", value: "Value 4" },
            { label: "Spec 5", value: "Value 5" },
          ],
          details: {
            title: "Detail Section 3",
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
      {
        position: new THREE.Vector3(-0.035, -0.19, 0.35),
        name: "4",
        heading: "HEADING 4",
        description:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
        popupDirection: "leftPopup",
        newCameraYOffset: 30,
        newCameraXOffset: 1,
        sidebar: {
          sidebarHeading: "",
          specsHeading: "Specifications",
          subHeading: "",
          specs: [
            { label: "Spec 1", value: "Value 1" },
            { label: "Spec 2", value: "Value 2" },
            { label: "Spec 3", value: "Value 3" },
            { label: "Spec 4", value: "Value 4" },
            { label: "Spec 5", value: "Value 5" },
          ],
          details: {
            title: "Detail Section 4",
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
      {
        position: new THREE.Vector3(0.055, 0.32, 0.43),
        name: "5",
        heading: "HEADING 6",
        description:
          "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.",
        popupDirection: "rightPopup",
        newCameraXOffset: 7,
        sidebar: {
          sidebarHeading: "",
          specsHeading: "Specifications",
          subHeading: "",
          specs: [
            { label: "Spec 1", value: "Value 1" },
            { label: "Spec 2", value: "Value 2" },
            { label: "Spec 3", value: "Value 3" },
            { label: "Spec 4", value: "Value 4" },
            { label: "Spec 5", value: "Value 5" },
          ],
          details: {
            title: "Detail Section 6",
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
      {
        position: new THREE.Vector3(-0.15, 0.425, -0.44),
        name: "6",
        heading: "HEADING 5",
        description:
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
        popupDirection: "rightPopup",
        newCameraXOffset: -35,
        sidebar: {
          sidebarHeading: "",
          specsHeading: "Physical Specifications",
          subHeading: "",
          specs: [
            { label: "Spec 1", value: "Value 1" },
            { label: "Spec 2", value: "Value 2" },
            { label: "Spec 3", value: "Value 3" },
            { label: "Spec 4", value: "Value 4" },
            { label: "Spec 5", value: "Value 5" },
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
