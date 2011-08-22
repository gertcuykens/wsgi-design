# Copyright(c) gert.cuykens@gmail.com
from time import strftime, gmtime, time

class Session(object):
    SID = None
    UID = None
    GID = None
 
    def __init__(self,s,db,g):
        self.SID=s
        self.__db=db
        self.GID = g
        try: self.validate()
        except IndexError: self.GID='login'

    def validate(self):
        if not self.SID: raise IndexError
        self.__db.execute('SELECT sessions.uid,sessions.exp FROM sessions INNER JOIN groups ON sessions.uid = groups.uid WHERE sessions.sid=? AND sessions.exp>? AND groups.gid=?',(self.SID,strftime('%Y-%m-%d %H:%M:%S', gmtime(time())),self.GID))
        self.UID = self.__db.fetch()[0][0]
        self.__db.execute('UPDATE sessions SET exp=? WHERE uid=?',(strftime('%Y-%m-%d %H:%M:%S', gmtime(time()+3600)),self.UID))
        #import sys
        #print (self.UID, file=sys.stderr)

