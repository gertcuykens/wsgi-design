# Copyright(c) gert.cuykens@gmail.com
import sqlite3
import os
from binascii import hexlify

class Db(object):
    ERROR       = None
    LASTROWID   = None
    DESCRIPTION = None
    ROWCOUNT    = 0
    TRANSACTION = False
    SQL         = None

    def __init__(self):
        self.connect()

    def __del__(self):
        self.close()

    def connect(self):
        try:
            self.__db = sqlite3.connect(os.path.join(os.path.dirname(__file__),"db.bin"))
            self.__cs = self.__db.cursor()
        except sqlite3.OperationalError as e:
            self.ERROR = e.args[0]
            print (self.ERROR)
            
    def execute(self,sql,v=None):
        self.SQL = (sql,v)
        try:
            if v: self.__cs.execute(sql,v)
            else: self.__cs.execute(sql)
            self.DESCRIPTION=self.__cs.description
            self.ROWCOUNT=self.__cs.rowcount
            self.LASTROWID=self.__cs.lastrowid
            if self.TRANSACTION == False : self.__db.commit()
        except sqlite3.Error as e:
            self.ERROR = sql + "\n\n" + e.args[0]
            print (self.ERROR)

    def commit(self):
        try:
            self.TRANSACTION = False
            self.__db.commit()
        except sqlite3.Error as e:
            self.ERROR = e.args[0]
            print (self.ERROR)
   
    def rollback(self):
        try:
            self.TRANSACTION = False
            self.__db.rollback()
        except sqlite3.Error as e:
            self.ERROR = e.args[0]
            print (self.ERROR)

    def fetch(self):
        try:
            data = self.__cs.fetchall()
            return data
        except sqlite3.Error as e:
            self.ERROR = e.args[0]
            print (self.ERROR)
            return None

    def jdes(self):
        j = '['
        if self.DESCRIPTION:
            for i in self.DESCRIPTION:
                j+= '"'+str(i[0]).replace('"','\\"')+'",'
            j = j[0:-1]
        j+= ']'
        return j

    def json(self):
        f = self.fetch()
        j = '['
        if f:
            for r in f:
                j+= '['
                for i in r:
                    j+= '"'+str(i).replace('"','\\"')+'",'
                j = j[0:-1]
                j+= '],'
            j = j[0:-1]
        j+= ']'
        return j

    def close(self):
        try:
            self.__cs.close()
        except sqlite3.Error as e:
            self.ERROR = e.args[0]
            print (self.ERROR)
        finally:
            self.__db.close()

