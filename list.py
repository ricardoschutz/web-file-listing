#!/usr/bin/python
import os, json, re
import cgi
import cgitb

print "Content-Type: application/json\n"

arguments = cgi.FieldStorage()

class ListFile(object):
    def __init__(self):
        self.name = ""
        self.isDir = False

def listPath(p):
    output = []
    fileList = os.listdir(p)
    for a in fileList:
        b = ListFile()
        b.name = a
        b.isDir = os.path.isdir(p+'/'+a)
        output.append(b)
    
    print json.dumps([item.__dict__ for item in output])

try:
    arguments["path"]
except NameError:
    listPath("./files/")
else:
    pathRE = re.compile(".*\.\.\/.*")
    if not pathRE.match(arguments["path"].value):
        listPath("./files/"+arguments["path"].value)
    else:
        print "Could you please stop messing around? Thank you very much :)"

