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

--EMPLOYEE
INSERT INTO BI.Employee(
	Employee_Name,
	Employee_Last_Name,
	Employee_User_Id,
	FK_Deparment_Id
	)
	VALUES (
	'Angel',
	'Gomez',
	'angelgomezslog',
	1
	);

INSERT INTO BI.Employee(
	Employee_Name,
	Employee_Last_Name,
	Employee_User_Id,
	FK_Deparment_Id
	)
	VALUES (
	'Josue',
	'Sanchez',
	'josueslog',
	1
	);

INSERT INTO BI.Employee(
	Employee_Name,
	Employee_Last_Name,
	Employee_User_Id,
	FK_Deparment_Id
	)
	VALUES (
	'Maria',
	'Garcia',
	'mgarciaslog',
	5
	);

INSERT INTO BI.Employee(
	Employee_Name,
	Employee_Last_Name,
	Employee_User_Id,
	FK_Deparment_Id
	)
	VALUES (
	'Robert',
	'Fraze',
	'robertlog',
	3
	);

--ORGANIZATION
INSERT INTO BI.Organization(
	Organization_Name,
	Organization_Type
	)
	VALUES (
	'SVO',
	'Corporate'
	);

INSERT INTO BI.Organization(
	Organization_Name,
	Organization_Type
	)
	VALUES (
	'APS',
	'Agency'
	);

INSERT INTO BI.Organization(
	Organization_Name,
	Organization_Type
	)
	VALUES (
	'ESH',
	'Association'
	);

INSERT INTO BI.Organization(
	Organization_Name,
	Organization_Type
	)
	VALUES (
	'RCP',
	'Agency'
	);

INSERT INTO BI.Organization(
	Organization_Name,
	Organization_Type
	)
	VALUES (
	'PEPSI',
	'AMC'
	);

--PRODUCT TYPE
INSERT INTO BI.Product_Type(
	Type_Name,
	Description
	)
	VALUES (
	'Scanning',
	'This is for scanning QR codes so we can handle users entry to events'
	);

INSERT INTO BI.Product_Type(
	Type_Name,
	Description
	)
	VALUES (
	'Virtual',
	'It is very useful for events for displaying events through streaming'
	);

INSERT INTO BI.Product_Type(
	Type_Name,
	Description
	)
	VALUES (
	'Virtual',
	'It is very useful for events for displaying events through streaming'
	);

--PRODUCT
INSERT INTO BI.Product(
	Product_Name,
	FK_Product_Type_Id
	)
	VALUES (
	'Scanlogic',
	1
	);

INSERT INTO BI.Product(
	Product_Name,
	FK_Product_Type_Id
	)
	VALUES (
	'Participantlogic',
	3
	);

INSERT INTO BI.Product(
	Product_Name,
	FK_Product_Type_Id
	)
	VALUES (
	'Virtualogic',
	2
	);

--CLIENT
INSERT INTO BI.Client(
	Client_Name,
	Client_Last_Name,
	Client_Telephone,
	Client_Email,
	User_Agent,
	FK_Organization_Id,
	FK_City_Id
	)
	VALUES (
	'Lucinda',
	'Lopez',
	'0223133',
	'luci@gmail.com',
	'Google Chrome',
	2,
	3
	);

INSERT INTO BI.Client(
	Client_Name,
	Client_Last_Name,
	Client_Telephone,
	Client_Email,
	User_Agent,
	FK_Organization_Id,
	FK_City_Id
	)
	VALUES (
	'Ronaldo',
	'Cortez',
	'0145733',
	'ronl_12@outlook.com',
	'Motzilla',
	4,
	1
	);

INSERT INTO BI.Client(
	Client_Name,
	Client_Last_Name,
	Client_Telephone,
	Client_Email,
	User_Agent,
	FK_Organization_Id,
	FK_City_Id
	)
	VALUES (
	'Ruth',
	NULL,
	'03216981',
	'rock@gmail.com',
	'Motzilla',
	4,
	2
	);

INSERT INTO BI.Client(
	Client_Name,
	Client_Last_Name,
	Client_Telephone,
	Client_Email,
	User_Agent,
	FK_Organization_Id,
	FK_City_Id
	)
	VALUES (
	'Fernando',
	'Torres',
	'23329211',
	'fer22@svo.com',
	'Safari',
	1,
	1
	);

--QUESTION
INSERT INTO BI.Question(
	Description,
	Priority,
	Question_Date,
	Question_Type,
	FK_Status_Id,
	FK_Client_Id
	)
	VALUES (
	'How can I delete an abstract?',
	'Medium',
	'2022-11-01',
	'knowledge',
	2,
	1
	);

INSERT INTO BI.Question(
	Description,
	Priority,
	Question_Date,
	Question_Type,
	FK_Status_Id,
	FK_Client_Id
	)
	VALUES (
	'Import participants is not working',
	'High',
	'2022-10-25',
	'failure',
	2,
	3
	);

--ANSWER
INSERT INTO BI.Answer(
	Result,
	Qualification,
	Answer_Date,
	FK_Question_Id,
	FK_Employee_Id
	)
	VALUES (
	'Click on the abstract id and then on the trash icon',
	3,
	'2022-10-26',
	1,
	1
	);

	INSERT INTO BI.Answer(
	Result,
	Qualification,
	Answer_Date,
	FK_Question_Id,
	FK_Employee_Id
	)
	VALUES (
	'Go to the participant view at the bottom is the import refresh',
	0,
	'2022-10-26 00:26',
	4,
	1
	);