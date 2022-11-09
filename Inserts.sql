--INSERTS 

--STATUS
INSERT INTO BI.Status(
	Status_Description
	)
	VALUES ('Active');

INSERT INTO BI.Status(
	Status_Description
	)
	VALUES ('Pending');

INSERT INTO BI.Status( 
	Status_Description
	)
	VALUES ('Solved');

INSERT INTO BI.Status(
	Status_Description
	)
	VALUES ('On Hold');

--COUNTRY
INSERT INTO BI.Country(
	 Country_Name, Country_Code
	)
	VALUES ('Germany', 'de');
	
INSERT INTO BI.Country(
	 Country_Name, Country_Code)
	VALUES ('Argentina', 'ar');

INSERT INTO BI.Country(
	 Country_Name, Country_Code)
	VALUES ('Belgium', 'be');

---STATE
INSERT INTO BI.State(
	State_Name, FK_Country_Id
	)
	VALUES ('Berlin', 1);

INSERT INTO BI.State(
	State_Name, FK_Country_Id
	)
	VALUES ('Hamburg', 1);

INSERT INTO BI.State(
	State_Name, FK_Country_Id
	)
	VALUES ('Cordoba', 2);

INSERT INTO BI.State(
	State_Name, FK_Country_Id
	)
	VALUES ('Antwerp', 3);

INSERT INTO BI.State(
	State_Name, FK_Country_Id
	)
	VALUES ('Brabant', 3);

--CITY
INSERT INTO BI.City(
	City_Name, FK_State_Id
	)
	VALUES ('Düsseldorf', 1);

INSERT INTO BI.City(
	City_Name, FK_State_Id
	)
	VALUES ('Leipzig', 1);

INSERT INTO BI.City(
	City_Name, FK_State_Id
	)
	VALUES ('Santa María', 2);

INSERT INTO BI.City(
	City_Name, FK_State_Id
	)
	VALUES ('Calamuchita', 2);

INSERT INTO BI.City(
	City_Name, FK_State_Id
	)
	VALUES ('Antwerp', 3);

--DEPARTMENT

INSERT INTO BI.Department(
	Department_Name
	)
	VALUES ('Support');

INSERT INTO BI.Department(
	Department_Name
	)
	VALUES ('Bizdev');

INSERT INTO BI.Department(
	Department_Name
	)
	VALUES ('Marketing');