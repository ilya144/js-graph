#!/usr/bin/python3
import xlrd
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__name__))
STDOUT = 'stdout'


def dump_sheet(sh, out, row=None):
    keys_enum = lambda: enumerate(sh.row_values(0))

    if row!=None:
        for index, col in keys_enum():
            out[col.lower()] = sh.cell_value(row, index)
        return
    for row in range(2, sh.nrows):
        new_row = {}
        for index, col in keys_enum():
            try:
                json_data = json.loads(sh.cell_value(row, index))
                new_row[col.lower()] = json_data
                continue
            except:
                new_row[col.lower()] = sh.cell_value(row, index)
        out.append(new_row)

def get_excel_out(excel_file):
    out = \
    {
        "data":{
            "edges":[], 
            "nodes":[],
            "detail":{}
        },
        "meta":{}
    }

    #with xlrd.open_workbook(os.path.join(BASE_DIR, "graph.xlsx")) as book:
    with xlrd.open_workbook(excel_file) as book:
        for sh in book.sheets():
            if sh.name=="Список таблиц":
                for index, key in enumerate(sh.col_values(0)):
                    out["meta"][key] = sh.cell_value(index, 1)

            if "edges" in sh.name:
                dump_sheet(sh, out["data"]["edges"])
            if "nodes" in sh.name:
                dump_sheet(sh, out["data"]["nodes"])
            if "detail" in sh.name:
                dump_sheet(sh, out["data"]["detail"], row=2)
    return out

def parse_flags(sys_args):
    flags={'s': False, 'h': False}
    flags_aliases={
        '-s': 's',
        '--stdout': 's',
        '-h': 'h',
        '--help': 'h'
    }
    for flag in filter(lambda a: a[0] == '-', sys_args):
        if flag in flags_aliases:
            flags[flags_aliases[flag]] = True
        else:
            print(
            f"Unexpected flag '{flag}'\nTry './xlsx_json.py -h' for help"
            )
            exit()

    return flags

def parse_files(sys_args):
    return [arg for arg in sys_args[1:] if arg[0]!='-']


def print_help():
    print("""\
Usage: ./xlsx_json.py [OPTION]... [FILE]...
Convert excel data into json, compatible with js-graph app

Options:
  -s, --stdout              return json into stdout stream
  -h, --help                show this message
    """)

if __name__ == "__main__":
    flags = parse_flags(sys.argv)
    input_files = parse_files(sys.argv)

    if flags['h'] or len(input_files) == 0:
        print_help()
        exit()
    
    for fil in input_files:
        if not os.path.exists(fil):
            continue
        out = get_excel_out(fil)
        if flags['s']:
            print(json.dumps(out))
        else:
            with open(f"{fil}.json", "w") as f:
                f.write(json.dumps(out))
        

   
