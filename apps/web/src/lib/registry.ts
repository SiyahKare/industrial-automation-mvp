export const Registry = {
  sensor: {
    type: "sensor", label: "Sensor", category: "I/O",
    inputs: [], outputs: [{ key:"out", label:"Value", type:"number" }],
    params: [
      { key:"tag", label:"Tag", type:"sensorTag", required:true },
      { key:"unit", label:"Unit", type:"unit", default:"kW", required:false }
    ],
    icon: "Activity",
  },
  constant: {
    type:"constant", label:"Constant", category:"Math",
    inputs: [],
    outputs:[{key:"out", label:"Value", type:"number"}],
    params:[{ key:"value", label:"Value", type:"number", default:0, step:0.1, required:false }]
  },
  multiply: {
    type:"multiply", label:"Multiply", category:"Math",
    inputs:[{key:"a", label:"A", type:"number"},{key:"b", label:"B", type:"number"}],
    outputs:[{key:"out", label:"A×B", type:"number"}],
    params:[]
  },
  integrator: {
    type:"integrator", label:"Integrator", category:"Math",
    inputs:[{key:"in", label:"Signal", type:"number"}],
    outputs:[{key:"out", label:"∫", type:"number"}],
    params:[{ key:"window", label:"Window (min)", type:"number", default:60, required:false }]
  },
  tariff: {
    type:"tariff", label:"Tariff", category:"Cost",
    inputs:[{key:"power", label:"Power (kW)", type:"number"}],
    outputs:[{key:"cost", label:"Cost (TRY/h)", type:"number"}],
    params:[
      { key:"price", label:"TRY/kWh", type:"number", default:3.0, step:0.01, required:false },
      { key:"schedule", label:"Schedule", type:"select", options:[
        {label:"Flat", value:"flat"},{label:"Day/Night", value:"dn"}
      ], default:"flat", required:false }
    ]
  },
  out: {
    type:"out", label:"Output", category:"I/O",
    inputs:[{key:"in", label:"Input", type:"number"}],
    outputs:[],
    params:[{ key:"name", label:"Name", type:"string", default:"Result", required:false }]
  }
} as const;
