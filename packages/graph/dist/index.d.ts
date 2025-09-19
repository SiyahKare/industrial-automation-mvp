import { z } from 'zod';
export declare const NodeId: z.ZodString;
export type NodeId = z.infer<typeof NodeId>;
export declare const NodeType: z.ZodEnum<["sensor", "actuator", "logic", "ui"]>;
export type NodeType = z.infer<typeof NodeType>;
export declare const Port: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["input", "output"]>;
    dataType: z.ZodEnum<["number", "string", "boolean"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "input" | "output";
    dataType: "string" | "number" | "boolean";
}, {
    id: string;
    kind: "input" | "output";
    dataType: "string" | "number" | "boolean";
}>;
export type Port = z.infer<typeof Port>;
export declare const GraphNode: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["sensor", "actuator", "logic", "ui"]>;
    label: z.ZodString;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    inputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["input", "output"]>;
        dataType: z.ZodEnum<["number", "string", "boolean"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }, {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }>, "many">>;
    outputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["input", "output"]>;
        dataType: z.ZodEnum<["number", "string", "boolean"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }, {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }>, "many">>;
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "sensor" | "actuator" | "logic" | "ui";
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    inputs: {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }[];
    outputs: {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }[];
    config?: Record<string, any> | undefined;
}, {
    type: "sensor" | "actuator" | "logic" | "ui";
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    inputs?: {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }[] | undefined;
    outputs?: {
        id: string;
        kind: "input" | "output";
        dataType: "string" | "number" | "boolean";
    }[] | undefined;
    config?: Record<string, any> | undefined;
}>;
export type GraphNode = z.infer<typeof GraphNode>;
export declare const GraphEdge: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodString;
    sourceHandle: z.ZodOptional<z.ZodString>;
    target: z.ZodString;
    targetHandle: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | undefined;
    targetHandle?: string | undefined;
}, {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | undefined;
    targetHandle?: string | undefined;
}>;
export type GraphEdge = z.infer<typeof GraphEdge>;
export declare const Graph: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["sensor", "actuator", "logic", "ui"]>;
        label: z.ZodString;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>;
        inputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<["input", "output"]>;
            dataType: z.ZodEnum<["number", "string", "boolean"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }, {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }>, "many">>;
        outputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<["input", "output"]>;
            dataType: z.ZodEnum<["number", "string", "boolean"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }, {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }>, "many">>;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "sensor" | "actuator" | "logic" | "ui";
        id: string;
        label: string;
        position: {
            x: number;
            y: number;
        };
        inputs: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[];
        outputs: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[];
        config?: Record<string, any> | undefined;
    }, {
        type: "sensor" | "actuator" | "logic" | "ui";
        id: string;
        label: string;
        position: {
            x: number;
            y: number;
        };
        inputs?: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[] | undefined;
        outputs?: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[] | undefined;
        config?: Record<string, any> | undefined;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        sourceHandle: z.ZodOptional<z.ZodString>;
        target: z.ZodString;
        targetHandle: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | undefined;
        targetHandle?: string | undefined;
    }, {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | undefined;
        targetHandle?: string | undefined;
    }>, "many">;
    version: z.ZodLiteral<1>;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: "sensor" | "actuator" | "logic" | "ui";
        id: string;
        label: string;
        position: {
            x: number;
            y: number;
        };
        inputs: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[];
        outputs: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[];
        config?: Record<string, any> | undefined;
    }[];
    edges: {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | undefined;
        targetHandle?: string | undefined;
    }[];
    version: 1;
}, {
    nodes: {
        type: "sensor" | "actuator" | "logic" | "ui";
        id: string;
        label: string;
        position: {
            x: number;
            y: number;
        };
        inputs?: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[] | undefined;
        outputs?: {
            id: string;
            kind: "input" | "output";
            dataType: "string" | "number" | "boolean";
        }[] | undefined;
        config?: Record<string, any> | undefined;
    }[];
    edges: {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | undefined;
        targetHandle?: string | undefined;
    }[];
    version: 1;
}>;
export type Graph = z.infer<typeof Graph>;
export declare function createEmptyGraph(): Graph;
