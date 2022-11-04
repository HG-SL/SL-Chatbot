CREATE SCHEMA BI_DW;

CREATE TABLE BI_DW.Dim_Time(
    Sk_Dim_Time INT NOT NULL IDENTITY  PRIMARY KEY,
    Year nvarchar(25) NOT NULL,
    Month nvarchar(25) NOT NULL,
    Day nvarchar(25) NOT NULL,
    Full_Date nvarchar(25) smalldatetime NOT NULL,
    Full_Hour nvarchar(50) NOT NULL,
    Flag_Weekend BIT
);

CREATE TABLE BI_DW.Dim_Status (
    SK_Dim_Status INT NOT NULL IDENTITY  PRIMARY KEY,
    Status_Description nvarchar(50) NOT NULL
);

CREATE TABLE BI_DW.Dim_Location (
    SK_Dim_Location INT NOT NULL  IDENTITY  PRIMARY KEY,
    Country_Name nvarchar(255) NOT NULL,
    State_Name nvarchar(255) NOT NULL,
    City_Name nvarchar(255) NOT NULL
);

CREATE TABLE BI_DW.Dim_Employee (
    SK_Dim_Employee INT NOT NULL  IDENTITY  PRIMARY KEY,
    Employee_Name nvarchar(50),
    Employee_Last_Name nvarchar(50),
    Employee_User_Id nvarchar(50) NOT NULL
);

CREATE TABLE BI_DW.Dim_Department (
    SK_Dim_Department INT NOT NULL IDENTITY  PRIMARY KEY,
    Department_Name nvarchar(50) NOT NULL
);

CREATE TABLE BI_DW.Dim_Organization (
    SK_Dim_Organization  INT NOT NULL  IDENTITY  PRIMARY KEY,
	Organization_Name nvarchar(200) NOT NULL UNIQUE,
    Organization_Type nvarchar(100) NOT NULL
);

CREATE TABLE BI_DW.Dim_Client (
    SK_Dim_Client INT NOT NULL  IDENTITY  PRIMARY KEY,
	Client_Name nvarchar(50),
    Client_Last_Name nvarchar(50), 
    Client_Telephone nvarchar(255), 
    Client_Email nvarchar(255) NOT NULL,
    User_Agent nvarchar(255)
);

CREATE TABLE BI_DW.Dim_Product (
    SK_Dim_Product INT NOT NULL  IDENTITY  PRIMARY KEY,
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
    Qualification INT NOT NULL,
    Question nvarchar(255) NOT NULL,
    Response nvarchar(50) NOT NULL,
    CONSTRAINT FK_Time FOREIGN KEY (Sk_Dim_Time)
    REFERENCES BI_DW.Dim_Time(Status_Id),

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
