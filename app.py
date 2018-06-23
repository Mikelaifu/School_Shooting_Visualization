from flask import Flask, render_template, jsonify, redirect
import datetime as dt
import numpy as np
import pandas as pd
import json
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

app = Flask(__name__)

engine = create_engine("sqlite:///school.sqlite")
Base = automap_base()

print(Base.classes.keys())
Base.prepare(engine, reflect= True)
School_shooting = Base.classes.School_shooting
session = Session(engine)


app = Flask(__name__)

# def getData():
#     result = session.query(School_shooting.Date, School_shooting.Location, School_shooting.State, School_shooting.Latitude, 
#                        School_shooting.Longitude, School_shooting.School_Name, School_shooting.Death,
#                       School_shooting.Injuries , School_shooting.School_Type).all()
#     df2 = pd.DataFrame(result)
#     df2['Year'] = ['20' + str(j).split("/")[2] for j in df2['Date']] 
#     return df2
def dictTranform(dict_list):
        df = pd.DataFrame(dict_list)
        names = list(df.columns)
        Outerlst = []
        for i in range(len(df)):
            innerList = []
            for j in range(len(names)):
                innerList.append(df.loc[i, names[j]])
            Outerlst.append(dict(zip(names, innerList)))
        return Outerlst
# cant put any function that pull data and use that data that pulled here later in each route
# def schoolType(name):
#         result = session.query(School_shooting.State, School_shooting.School_Name, School_shooting.School_Type).all()
#         df2 = pd.DataFrame(result)
#         df2 = df2.dropna()
#         df2['State'] = [i.strip() for i in df2['State']]
#         mask = df2['State'] == name
#         df = df2[mask]
#         count = df.groupby(['School_Type']).agg({"School_Name": "count"})
#         count = count.reset_index()
#         schoolType =list(df['School_Type'].unique())
#         School_list = []
#         for types in schoolType:
#             mask = df["School_Type"] == types
#             School_list.append(list(df[mask]['School_Name']))
            
#         ticks = dict(zip(schoolType, School_list))
#         return ticks


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/table")
def table():
    return render_template("table.html")

@app.route("/year")
def yearOPtion():
    session = Session(engine)
    result = session.query(School_shooting.Date, School_shooting.Location, School_shooting.State, School_shooting.Latitude, 
                       School_shooting.Longitude, School_shooting.School_Name, School_shooting.Death,
                      School_shooting.Injuries , School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2['Year'] = ['20' + str(j).split("/")[2] for j in df2['Date']] 
    
    df2['Date'] = pd.to_datetime(df2['Date'])
    str_date = [str(date) for date in df2['Date'].dt.year]
    
    yearlst = list(set(str_date))
    yearlst.sort()
    session.close()
    return jsonify(yearlst)

@app.route("/state")
def stateOPtion():
    session = Session(engine)
    result = session.query(School_shooting.Date, School_shooting.Location, School_shooting.State, School_shooting.Latitude, 
                       School_shooting.Longitude, School_shooting.School_Name, School_shooting.Death,
                      School_shooting.Injuries , School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2['Year'] = ['20' + str(j).split("/")[2] for j in df2['Date']] 
    
    df2['State'] = [i.strip() for i in df2['State']]
    
    statelst = list(df2['State'].unique())
    statelst.sort()
    session.close()
    return jsonify(statelst)

@app.route("/map/<year>")
def map(year):
    session = Session(engine)
    result = session.query(School_shooting.Date, School_shooting.Location, School_shooting.State, School_shooting.Latitude, 
                       School_shooting.Longitude, School_shooting.School_Name, School_shooting.Death,
                      School_shooting.Injuries , School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2['Year'] = ['20' + str(j).split("/")[2] for j in df2['Date']] 
    df2['Date'] = pd.to_datetime(df2['Date'])
    mask = df2["Year"] == str(year)
    yr = df2[mask]
    yr['Date'] = [str(j).split(" ")[0] for j in yr['Date']]
    df = yr
    df
    names = list(df.columns)
    Outerlst = []
    for i in range(len(df)):
        innerList = []
        for j in range(len(names)):
            innerList.append(df.iloc[i, names.index(names[j])])
            #print(innerList)
        Outerlst.append(dict(zip(names, innerList)))
    for index in range(len(Outerlst)):

        for key, value in Outerlst[index].items():

            if value == str:
                next
            else:
                Outerlst[index][key] = np.asscalar(np.array([value])) 
    session.close()
    return jsonify(Outerlst)

@app.route("/type/<state_name>")
def State_schoolType(state_name):
    session = Session(engine)
    result = session.query(School_shooting.State, School_shooting.School_Name, School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2 = df2.dropna()
    df2['State'] = [i.strip() for i in df2['State']]    
    statelst = list(df2['State'].unique())
    statelst.sort()
    def schoolType(name):
        result = session.query(School_shooting.State, School_shooting.School_Name, School_shooting.School_Type).all()
        df2 = pd.DataFrame(result)
        df2 = df2.dropna()
        df2['State'] = [i.strip() for i in df2['State']]
        mask = df2['State'] == name
        df = df2[mask]
        count = df.groupby(['School_Type']).agg({"School_Name": "count"})
        count = count.reset_index()
        schoolType =list(df['School_Type'].unique())
        School_list = []
        for types in schoolType:
            mask = df["School_Type"] == types
            School_list.append(list(df[mask]['School_Name']))
            
        ticks = dict(zip(schoolType, School_list))
        return ticks
    stateDict = {}
    for name in statelst:
        stateDict[name] = schoolType(name)
    session.close()
    return jsonify(stateDict[state_name])
    
@app.route("/table1/<state_name>")
def table1(state_name):
    session = Session(engine)
    result = session.query(School_shooting.State, School_shooting.School_Name, School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2 = df2.dropna()
    df2['State'] = [i.strip() for i in df2['State']]    
    statelst = list(df2['State'].unique())
    statelst.sort()
    def schoolType(name):
        result = session.query(School_shooting.State, School_shooting.School_Name, School_shooting.School_Type).all()
        df2 = pd.DataFrame(result)
        df2 = df2.dropna()
        df2['State'] = [i.strip() for i in df2['State']]
        mask = df2['State'] == name
        df = df2[mask]
        count = df.groupby(['School_Type']).agg({"School_Name": "count"})
        count = count.reset_index()
        schoolType =list(df['School_Type'].unique())
        School_list = []
        for types in schoolType:
            mask = df["School_Type"] == types
            School_list.append(list(df[mask]['School_Name']))
            
        ticks = dict(zip(schoolType, School_list))
        return ticks
    stateDict = {}
    for name in statelst:
        stateDict[name] = schoolType(name)
    target = stateDict[state_name]
    keylength = []
    length = []
    for key, val in target.items():
        keylength.append(key) 
        length.append(len(val))
    length.index(max(length))
    for key, val in target.items():
        if len(val) != max(length):
            target[key] = target[key] + ["-" for i in range(max(length)-len(val))]

    final = dictTranform(target)
    session.close()
    return jsonify(final)

@app.route("/table2")
def table2():
    session = Session(engine)
    result = session.query(School_shooting.Date, School_shooting.Location, School_shooting.State,  School_shooting.School_Name, School_shooting.Death,
                      School_shooting.Injuries, School_shooting.School_Type).all()
    df2 = pd.DataFrame(result)
    df2['Date'] = pd.to_datetime(df2['Date'])
    df2['Date'] = [str(i).split(' ')[0] for i in df2['Date']]
    comboLst = list(zip(df2['Death'][130:], df2["Injuries"][130:]))
    Death = []
    Injury = []
    for j in comboLst:
        if j[0] == 0 and j[1] == 0:
            Death.append("-")
            Injury.append("-")
        else:
            Death.append(j[0])
            Injury.append(j[1])
    df2['Death'] = list(df2['Death'][0:130]) + Death
    df2['State'] = [i.split()[0] for i in df2['State']]
    df2['Injuries'] = list(df2['Injuries'][0:130]) + Injury
    df2['Location'] = [i.upper() for i in df2['Location']] 
    Stype = []
    for i in df2['School_Type']:
        if i == None :
            Stype.append("-")
        else:
            Stype.append(i.upper().strip())
        
    df2['School_Type'] = Stype
    name = []
    for i in df2['School_Name']:
        if i == None :
            name.append("-")
        else:
            name.append(i.upper().strip())
        
    df2['School_Name'] = name
        
    
    nulllist = []
    for i in df2['School_Name']:
        if i == None:
            nulllist.append("-")
        else:
            nulllist.append(i)
    df2['School_Name'] = nulllist
    names = list(df2.columns)
    Outerlst = []
    for i in range(len(df2)):
        innerList = []
        for j in range(len(names)):
            innerList.append(df2.loc[i, names[j]])
        Outerlst.append(dict(zip(names, innerList)))
<<<<<<< HEAD
    session.close()
        
    return jsonify(Outerlst)


=======
>>>>>>> b49b925d2a0eab9b9edef13473deedbea49a9ecc
    
    return jsonify(Outerlst)

if __name__ == "__main__":
    app.run(debug=True)

