import { Parent, Block, BlockTypes } from "/static/modules/BaseBlock.mjs";

export default null;

new BlockTypes().add({
    "skll.plugin.tabular.FileInput": {
        cls: Block,
        typename: "Input from file",
        group: "tabular data",
        desc: "Tablular data input from a file",
        childof: "skll.baseblock.Block",
        properties: {
            "filename": {
                desc: "Name of input file",
                type: "file",
            },
            "column_mask": {
                hidden: true,
            },
            "row_filter": {
                hidden: true,
            },
        },
        defaults: {
            "disable_mask": ["run"],
        },
        events: {
            onFileDropped: (thiz, src, type) => {
                const filename = src.filename;
                const ext = filename.split(".").pop();
                switch (ext) {
                    case "csv":
                    case "xls":
                    case "xlsx":
                        thiz.filename = filename;
                        break;
                    default:
                        alert(`Unsupported file type ${ext}`);
                        return false;
                }
                thiz.render();
                return true;
            },
            onRender: (thiz) => {
                thiz.createDomElement();
                if (!thiz.filename) return;
                thiz.$div.find("span.title").html(`${thiz.name} (${thiz.filename})`);
            }
        },
    },
    "skll.plugin.tabular.SQLInput": {
        cls: Block,
        typename: "Input from sql",
        group: "tabular data",
        desc: "Tablular data input from database",
        childof: "skll.baseblock.Block",
        properties: {
            "connstr": {
                desc: "Connection string url",
                type: "url",
            },
            "column_mask": {
                hidden: true,
            },
            "row_filter": {
                hidden: true,
            },
        },
        defaults: {
            "disable_mask": ["run"],
        },
        events: {
            onFileDropped: (thiz, src, type) => {
                const filename = src.filename;
                const ext = filename.split(".").pop();
                switch (ext) {
                    case "sqlite":
                    case "sqlite3":
                        thiz.connstr = `sqlite:///${filename}`
                        const sql = prompt("And the SQL for data?", thiz.sql);
                        if (sql) thiz.sql = sql;
                        break;
                    default:
                        alert(`Unsupported file type ${ext}`);
                        return false;
                }
                thiz.render();
                return true;
            },
            onRender: (thiz) => {
                thiz.createDomElement();
                if (!thiz.filename) return;
                thiz.$div.find("span.title").html(`${thiz.name} (${thiz.connstr})`);
            }
        },
    },
    "skll.plugin.tabular.FileOutput": {
        cls: Block,
        typename: "File output",
        group: "tabular data",
        desc: "Output result to CSV file, it will append instead of overwrite, without checking for existing data structure",
        childof: "skll.baseblock.Block",
        properties: {
            "filename": {
                desc: "Name of input file",
                type: "file",
            },
        },
        events: {
            onFileDropped: (thiz, src, type) => {
                const filename = src.filename;
                const ext = filename.split(".").pop();
                switch (ext) {
                    case "csv":
                        thiz.filename = filename;
                        break;
                    default:
                        alert(`Only CSV file is supported`);
                        return false;
                }
                thiz.render();
                return true;
            },
            onRender: (thiz) => {
                thiz.createDomElement();
                if (!thiz.filename) return;
                thiz.$div.find("span.title").html(`${thiz.name} (${thiz.filename})`);
            }
        },
    },
    "skll.plugin.tabular.SQLOutput": {
        cls: Block,
        typename: "Output to sql",
        group: "tabular data",
        desc: "Write result into database",
        childof: "skll.baseblock.Block",
        properties: {
            "connstr": {
                desc: "Connection string url",
                type: "url",
            },
            "table_name": {
                desc: "table of database to write into",
                type: "string",
            },
            "schema": {
                desc: "schema of database (if supported)",
                type: "string",
                default: "None"
            },
        },
        events: {
            onFileDropped: (thiz, src, type) => {
                const filename = src.filename;
                const ext = filename.split(".").pop();
                switch (ext) {
                    case "sqlite":
                    case "sqlite3":
                        thiz.connstr = `sqlite:///${filename}`
                        const table_name = prompt("And the table to write to?", thiz.table_name);
                        if (table_name) thiz.table_name = table_name;
                        break;
                    default:
                        alert(`Unsupported file type ${ext}`);
                        return false;
                }
                thiz.render();
                return true;
            },
            onRender: (thiz) => {
                thiz.createDomElement();
                if (!thiz.filename) return;
                thiz.$div.find("span.title").html(`${thiz.name} (${thiz.connstr}/${thiz.table_name})`);
            }
        },
    },
    "skll.plugin.tabular.Method": {
        cls: Parent,
        typename: "Generic Method call",
        group: "tabular data.methods",
        desc: "Member method call to the datatable",
        childof: "skll.baseblock.Block",
        properties: {
            "_method": {
                desc: "method name",
                type: "string",
            },
            kargs: {
                desc: "parameters",
                type: "dict(string,string)",
            },
            transpose: {
                desc: "should result be tranposed before return",
                type: "boolean",
            }
        },
    },
    "skll.plugin.tabular.Subset": {
        cls: Parent,
        typename: "Subset Method",
        group: "tabular data.subsets",
        desc: "Group data into subsets and process one-at-a-time",
        childof: "skll.baseblock.Loop",
        properties: {
            "_method": {
                desc: "method name",
                type: "string",
            },
            kargs: {
                desc: "parameters",
                type: "dict(string,string)",
            },
        },
    },
    "skll.plugin.tabular.Drop": {
        cls: Block,
        typename: "Drop",
        group: "tabular data",
        desc: "Drop columns / rows by simply returning nothing",
        childof: "skll.baseblock.Block",
        properties: {
            as_new_columns: { hidden: true },
        },
        defaults: {
            as_new_columns: false,
        }
    },
    "skll.plugin.tabular.ColumnWise": {
        cls: Parent,
        typename: "Column Wise Operation",
        group: "tabular data",
        desc: "Transformation for each column",
        childof: "skll.baseblock.Parent",
    },
    "skll.plugin.tabular.XyidSplit": {
        cls: Block,
        typename: "Extract Y/ID Column",
        group: "tabular data",
        desc: "Specifying column for Y and/or Id",
        childof: "skll.baseblock.Block",
        properties: {
            "ycol": {
                desc: "name of y column",
                type: "column",
            },
            "idcol": {
                desc: "name of id column",
                type: "column",
            }
        }
    },
});

/**
 * Method shortcuts
 */
new BlockTypes().add({
    "skll.plugin.tabular.fillna": {
        "cls": Block,
        "typename": "Impute missing values",
        "desc": "Missing value impute",
        "childof": "skll.plugin.tabular.Method",
        "pytype": "skll.plugin.tabular.Method",
        "group": "tabular data.methods",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "transpose": {
                "hidden": true
            },
            "value": {
                "type": "formula",
                "desc": "Values for missing fields, can be any string/number or a formula(starting with a '=Prices.mean()')",
                "dictKeyOf": "kargs"
            },
        },
        "defaults": {
            "_method": "fillna",
            "transpose": false,
        }
    },
    "skll.plugin.tabular.apply": {
        "cls": Block,
        "typename": "Row-wise formula",
        "desc": "Process data row-by-row and output results as a column",
        "childof": "skll.plugin.tabular.Method",
        "pytype": "skll.plugin.tabular.Method",
        "group": "tabular data.methods",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "transpose": {
                "hidden": true
            },
            "func": {
                "type": "formula",
                "desc": "either name of a function(e.g. 'min') or a 'lambda-Xx' (starting with a '@', e.g. '@x.UnitPrice * x.Quantity')",
                "dictKeyOf": "kargs"
            },
        },
        "defaults": {
            "_method": "apply",
            "kargs": {
                "axis": 1
            },
            "transpose": false,
        }
    },
    "skll.plugin.tabular.agg": {
        "cls": Block,
        "typename": "Aggregate",
        "desc": "Aggregate rows into one signle row",
        "childof": "skll.plugin.tabular.Method",
        "pytype": "skll.plugin.tabular.Method",
        "group": "tabular data.methods",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "transpose": {
                "hidden": true
            },
            "func": {
                "type": "dict(column,formula)",
                "desc": "mapping of columns and function, could be a function name(e.g. 'min') or a formula or an 'lambda-Xx'",
                "dictKeyOf": "kargs"
            },
        },
        "defaults": {
            "_method": "agg",
            "kargs": {
                "axis": 0,
            },
            "transpose": true,
        }
    },
    "skll.plugin.tabular.groupby": {
        "cls": Parent,
        "typename": "Groupby",
        "desc": "Group DataFrame using a mapper or by a Series of columns.",
        "childof": "skll.plugin.tabular.Subset",
        "pytype": "skll.plugin.tabular.Subset",
        "group": "tabular data.subsets",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "by": {
                "type": "list(column)",
                "desc": "columns to group'",
                "dictKeyOf": "kargs"
            },
        },
        "defaults": {
            "_method": "groupby",
        }
    },
    "skll.plugin.tabular.rolling": {
        "cls": Parent,
        "typename": "Rolling",
        "desc": "Provide rolling window calculations.",
        "childof": "skll.plugin.tabular.Subset",
        "pytype": "skll.plugin.tabular.Subset",
        "group": "tabular data.subsets",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "window": {
                "type": "number",
                "desc": "Size of moving window",
                "dictKeyOf": "kargs"
            },
            "center": {
                "type": "boolean",
                "desc": "set the window labels as the center or the right edge of the window index",
                "dictKeyOf": "kargs",
            },
            "win_type": {
                "type": "string",
                "desc": "scipy.window function, or None for equally weighted points",
                "dictKeyOf": "kargs",
                "default": "None",
            },
            "on": {
                "type": "column",
                "desc": "column label on which to calculate the rolling window",
                "dictKeyOf": "kargs",
            },
        },
        "defaults": {
            "_method": "rolling",
        }
    },
    "skll.plugin.tabular.expanding": {
        "cls": Parent,
        "typename": "Expanding",
        "desc": "Provide expanding window calculations.",
        "childof": "skll.plugin.tabular.Subset",
        "pytype": "skll.plugin.tabular.Subset",
        "group": "tabular data.subsets",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "min_periods": {
                "type": "number",
                "desc": "Minimum number of observations in window required to have a value",
                "dictKeyOf": "kargs",
                "default": 1,
            },
            "center": {
                "type": "boolean",
                "desc": "set the window labels as the center or the right edge of the window index",
                "dictKeyOf": "kargs",
            },
        },
        "defaults": {
            "_method": "expanding",
        }
    },
    "skll.plugin.tabular.ewm": {
        "cls": Parent,
        "typename": "ewm",
        "desc": "Provide exponentially weighted (EW) calculations. Exactly one parameter: com, span, halflife, or alpha must be provided.",
        "childof": "skll.plugin.tabular.Subset",
        "pytype": "skll.plugin.tabular.Subset",
        "group": "tabular data.subsets",
        "properties": {
            "_method": {
                "hidden": true
            },
            "kargs": {
                "hidden": true
            },
            "com": {
                "type": "number",
                "desc": "Specify decay in terms of center of mass",
                "dictKeyOf": "kargs"
            },
            "span": {
                "type": "number",
                "desc": "Specify decay in terms of span",
                "dictKeyOf": "kargs"
            },
            "halflife": {
                "type": "number",
                "desc": "Specify decay in terms of half-life",
                "dictKeyOf": "kargs"
            },
            "alpha": {
                "type": "number",
                "desc": "Specify smoothing factor directly 0<alpha<1",
                "dictKeyOf": "kargs"
            },
            "min_periods": {
                "type": "number",
                "desc": "Minimum number of observations in window required to have a value",
                "dictKeyOf": "kargs",
                "default": 1,
            },
            "adjust": {
                "type": "boolean",
                "desc": "Divide by decaying adjustment factor in beginning periods to account for imbalance in relative weightings (viewing EWMA as a moving average).",
                "dictKeyOf": "kargs",
            },
            "ignore_na": {
                "type": "boolean",
                "desc": "Divide by decaying adjustment factor in beginning periods to account for imbalance in relative weightings (viewing EWMA as a moving average).",
                "dictKeyOf": "kargs",
            },
            "on": {
                "type": "column",
                "desc": "column label on which to calculate the rolling window",
                "dictKeyOf": "kargs",
            },
        },
        "defaults": {
            "_method": "ewm",
        }
    },
});