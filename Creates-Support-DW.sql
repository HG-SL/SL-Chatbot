CREATE SCHEMA BI_DW;

CREATE TABLE BI_DW.Dim_Time(
    Sk_Dim_Time INT NOT NULL  PRIMARY KEY,
    Year_Name nvarchar(25) NOT NULL,
    Month_Name nvarchar(25) NOT NULL,
    Day_Name nvarchar(25) NOT NULL,
    Full_Date smalldatetime NOT NULL,
    Full_Hour nvarchar(50) NOT NULL,
    Flag_Weekend BIT
);

CREATE TABLE BI_DW.Dim_Status (
    SK_Dim_Status INT NOT NULL  PRIMARY KEY,
    Status_Description nvarchar(50) NOT NULL,
    CONSTRAINT CHK_Status CHECK (Status_Description IN ('Active', 'Pending', 'Solved', 'On Hold'))
);

CREATE TABLE BI_DW.Dim_Location (
    SK_Dim_Location INT NOT NULL IDENTITY PRIMARY KEY,
    Country_Name nvarchar(255) NOT NULL,
    State_Name nvarchar(255) NOT NULL,
    City_Name nvarchar(255) NOT NULL,
    FK_Country INT,
    FK_State INT,
    FK_City INT
);

CREATE TABLE BI_DW.Dim_Employee (
    SK_Dim_Employee INT NOT NULL PRIMARY KEY,
    Employee_Name nvarchar(50),
    Employee_Last_Name nvarchar(50),
    Employee_User_Id nvarchar(50) NOT NULL
);

CREATE TABLE BI_DW.Dim_Department (
    SK_Dim_Department INT NOT NULL PRIMARY KEY,
    Department_Name nvarchar(50) NOT NULL,
    CONSTRAINT CHK_Department CHECK (Department_Name IN ('Support', 'Bizdev', 'Marketing')),
);

CREATE TABLE BI_DW.Dim_Organization (
    SK_Dim_Organization  INT NOT NULL PRIMARY KEY,
	Organization_Name nvarchar(200) NOT NULL UNIQUE,
    Organization_Type nvarchar(100) NOT NULL,
    CONSTRAINT CHK_Organization_Type CHECK (Organization_Type IN ('Corporate', 'Association', 'Non-profit', 'Agency', 'PCO', 'AMC'))
);

CREATE TABLE BI_DW.Dim_Client (
    SK_Dim_Client INT NOT NULL PRIMARY KEY,
	Client_Name nvarchar(50),
    Client_Last_Name nvarchar(50), 
    Client_Telephone nvarchar(255), 
    Client_Email nvarchar(255) NOT NULL,
    User_Agent nvarchar(255)
);

CREATE TABLE BI_DW.Dim_Product (
    SK_Dim_Product INT NOT NULL PRIMARY KEY,
    Product_Name nvarchar(50) NOT NULL,
    Product_Type nvarchar(50) NOT NULL
);

CREATE TABLE BI_DW.Fact_Requests (
	FK_Time_Id INT, 
    FK_Status_Id INT,
    FK_Location_Id INT,
    FK_Employee_Id INT,
    FK_Department_Id INT,
    FK_Organization_Id INT,
    FK_Client_Id INT,
    FK_Product_Id INT,
    Qualification INT,
    Question nvarchar(255),
    Question_Type nvarchar(50),
    Response nvarchar(50),
    
   	CONSTRAINT CHK_Question_Type CHECK (Question_Type IN ('knowledge','Failure')), --We define 0 for knowledge or 1 for a failure
   	CONSTRAINT CHK_Qualification CHECK (Qualification IN (0,1,2,3,4,5)),
   	
	CONSTRAINT FK_Time FOREIGN KEY (FK_Time_Id)
    REFERENCES BI_DW.Dim_Time(Sk_Dim_Time),

    CONSTRAINT FK_Status FOREIGN KEY (FK_Status_Id)
    REFERENCES BI_DW.Dim_Status(SK_Dim_Status),

    CONSTRAINT FK_Location FOREIGN KEY (FK_Location_Id)
    REFERENCES BI_DW.Dim_Location(SK_Dim_Location),

    CONSTRAINT FK_Employee FOREIGN KEY (FK_Employee_Id)
    REFERENCES BI_DW.Dim_Employee(SK_Dim_Employee),

    CONSTRAINT FK_Department FOREIGN KEY (FK_Department_Id)
    REFERENCES BI_DW.Dim_Department(SK_Dim_Department),

    CONSTRAINT FK_Organization FOREIGN KEY (FK_Organization_Id)
    REFERENCES BI_DW.Dim_Organization(SK_Dim_Organization),

	CONSTRAINT FK_Client FOREIGN KEY (FK_Client_Id)
    REFERENCES BI_DW.Dim_Client(SK_Dim_Client),

    CONSTRAINT FK_Product FOREIGN KEY (FK_Product_Id)
    REFERENCES BI_DW.Dim_Product(SK_Dim_Product)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

