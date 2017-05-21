export interface IConfigDefault {
    end(): Config;
}

export interface IConfigBoolean extends IConfigDefault {
    setBooleanValue(value: boolean): IConfigBoolean;
}

export interface IConfigNumber extends IConfigDefault {
    setNumberValue(value: number): IConfigNumber;
}

export interface IConfigString extends IConfigDefault {
    setStringValue(value: string): IConfigString;
}

export interface IConfigArray extends IConfigDefault {
    setArrayValue(value: any[]): IConfigArray;
}

export interface IConfig {
    addKey(name: string): IConfig;
    isArray(required?: boolean): IConfigArray;
    isString(required?: boolean): IConfigString;
    isNumber(required?: boolean): IConfigNumber;
    isBoolean(required?: boolean): IConfigBoolean;
}

export class Config implements IConfig, IConfigArray, IConfigString, IConfigNumber, IConfigBoolean {
    public static readonly TYPE_OBJ = 1;
    public static readonly TYPE_ARR = 2;
    public static readonly TYPE_STR = 4;
    public static readonly TYPE_NUM = 8;
    public static readonly TYPE_BOO = 16;

    protected name: string;
    protected parent: Config = null;
    protected type: number = Config.TYPE_OBJ;
    protected keys: Config[] = [];
    protected value: any = null;
    protected required: boolean = true;

    public constructor(name: string, parent?: Config, required: boolean = true) {
        this.name = name;
        this.parent = parent;
        this.required = required;
    }

    public addKey(name: string, required: boolean = true): IConfig {
        let key = new Config(name, this, required);

        this.type = Config.TYPE_OBJ;
        this.keys.push(key);
        return key;
    }

    public isArray(required: boolean = true): IConfigArray {
        this.required = required;
        this.type = Config.TYPE_ARR;
        return this;
    }

    public setArrayValue(value: any[]): IConfigArray {
        this.value = value;
        return this;
    }

    public isString(required: boolean = true): IConfigString {
        this.required = required;
        this.type = Config.TYPE_STR;
        return this;
    }

    public setStringValue(value: string): IConfigString {
        this.value = value;
        return this;
    }

    public isNumber(required: boolean = true): IConfigNumber {
        this.required = required;
        this.type = Config.TYPE_NUM;
        return this;
    }

    public setNumberValue(value: number): IConfigNumber {
        this.value = value;
        return this;
    }

    public isBoolean(required: boolean = true): IConfigBoolean {
        this.required = required;
        this.type = Config.TYPE_BOO;
        return this;
    }

    public setBooleanValue(value: boolean): IConfigBoolean {
        this.value = value;
        return this;
    }

    public end(): Config {
        return this.parent;
    }

    public getKey(key: string): Config {
        let config: Config = null;
        this.keys.map(c => {
            if (c.name === key) config = c;
        });
        return config;
    }

    public getValue() {
        if (this.type !== Config.TYPE_OBJ) {
            return this.value;
        } else {
            let value = {};
            this.keys.map(key => value[key.name] = key.getValue());
            return value;
        }
    }

    public push(config: Config) {
        this.keys.push(config);
    }

    public readConfiguration(data: any) {
        if (this.type === Config.TYPE_OBJ) {
            let keys = Object.keys(data);
            let missing = this.keys.filter(key => (!(key.required === false || keys.indexOf(key.name) !== -1)));
            // TODO: missing contains missing required configuration
            this.keys.map(key => {
                if (keys.indexOf(key.name) !== -1 && key.type === Config.TYPE_OBJ) {
                    key.readConfiguration(data[key.name]);
                } else if (keys.indexOf(key.name) !== -1) {
                    let value = data[key.name];
                    key.value = value;
                }
            });
        } else {
            this.value = data;
        }
    }
}
