import { z } from "zod";
export declare const ParamSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["string", "number", "boolean", "select", "credential", "unit", "sensorTag"]>;
    required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    placeholder: z.ZodOptional<z.ZodString>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    step: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        value: string;
    }, {
        label: string;
        value: string;
    }>, "many">>;
    default: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    key: string;
    label: string;
    type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
    required: boolean;
    options?: {
        label: string;
        value: string;
    }[] | undefined;
    placeholder?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    default?: any;
}, {
    key: string;
    label: string;
    type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
    options?: {
        label: string;
        value: string;
    }[] | undefined;
    required?: boolean | undefined;
    placeholder?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    default?: any;
}>;
export declare const PortSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["number", "boolean", "string", "series"]>;
    multiple: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    key: string;
    label: string;
    type: "string" | "number" | "boolean" | "series";
    multiple?: boolean | undefined;
}, {
    key: string;
    label: string;
    type: "string" | "number" | "boolean" | "series";
    multiple?: boolean | undefined;
}>;
export declare const NodeSpecSchema: z.ZodObject<{
    type: z.ZodString;
    label: z.ZodString;
    category: z.ZodString;
    inputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["number", "boolean", "string", "series"]>;
        multiple: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }>, "many">>;
    outputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["number", "boolean", "string", "series"]>;
        multiple: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }>, "many">>;
    params: z.ZodDefault<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["string", "number", "boolean", "select", "credential", "unit", "sensorTag"]>;
        required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        placeholder: z.ZodOptional<z.ZodString>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        step: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            value: string;
        }, {
            label: string;
            value: string;
        }>, "many">>;
        default: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
        required: boolean;
        options?: {
            label: string;
            value: string;
        }[] | undefined;
        placeholder?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        default?: any;
    }, {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
        options?: {
            label: string;
            value: string;
        }[] | undefined;
        required?: boolean | undefined;
        placeholder?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        default?: any;
    }>, "many">>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    label: string;
    type: string;
    params: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
        required: boolean;
        options?: {
            label: string;
            value: string;
        }[] | undefined;
        placeholder?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        default?: any;
    }[];
    category: string;
    inputs: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }[];
    outputs: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }[];
    icon?: string | undefined;
}, {
    label: string;
    type: string;
    category: string;
    params?: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "select" | "credential" | "unit" | "sensorTag";
        options?: {
            label: string;
            value: string;
        }[] | undefined;
        required?: boolean | undefined;
        placeholder?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
        default?: any;
    }[] | undefined;
    inputs?: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }[] | undefined;
    outputs?: {
        key: string;
        label: string;
        type: "string" | "number" | "boolean" | "series";
        multiple?: boolean | undefined;
    }[] | undefined;
    icon?: string | undefined;
}>;
export type NodeSpec = z.infer<typeof NodeSpecSchema>;
export type ParamDef = z.infer<typeof ParamSchema>;
export declare const Registry: Record<string, NodeSpec>;
