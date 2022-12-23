CREATE SCHEMA BI;

CREATE TABLE BI.Country (
    Country_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    Country_Name nvarchar(255) NOT NULL UNIQUE,
    Country_Code nvarchar(100) UNIQUE
);

CREATE TABLE BI.State (
    State_Id  INT NOT NULL  IDENTITY  PRIMARY KEY,
    State_Name nvarchar(255) NOT NULL,
    FK_Country_Id INT,
    CONSTRAINT FK_Country FOREIGN KEY (FK_Country_Id)
    REFERENCES BI.Country(Country_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BI.City (
    City_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    City_Name nvarchar(255) NOT NULL,
    FK_State_Id INT,
    CONSTRAINT FK_State FOREIGN KEY (FK_State_Id)
    REFERENCES BI.State(State_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BI.Organization (
    Organization_Id  INT NOT NULL  IDENTITY  PRIMARY KEY,
	Organization_Name nvarchar(200) NOT NULL UNIQUE,
    Organization_Type nvarchar(100), 
    Organization_Acronym nvarchar(50),
    CONSTRAINT CHK_Organization_Type CHECK (Organization_Type IN ('Corporate', 'Association', 'Non-profit', 'Agency', 'PCO', 'AMC'))
);

CREATE TABLE BI.Client (
    Client_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
	Client_Name nvarchar(50),
    Client_Family_Name nvarchar(50), 
    Client_Telephone nvarchar(255), 
    Client_Email nvarchar(255) NOT NULL,
    User_Agent nvarchar(255),
    FK_Organization_Id INT,
    FK_City_Id INT,
	CONSTRAINT FK_Organization FOREIGN KEY (FK_Organization_Id)
    REFERENCES BI.Organization(Organization_Id),
    CONSTRAINT FK_City FOREIGN KEY (FK_City_Id)
    REFERENCES BI.City(City_Id)
	ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BI.Status (
    Status_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    Status_Description nvarchar(50) NOT NULL, --Should be a check like (Pending, Active, Solved,...)
    CONSTRAINT CHK_Status CHECK (Status_Description IN ('Active', 'Pending', 'Solved', 'On Hold'))
);

CREATE TABLE BI.Question (
    Question_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    Description nvarchar(500) NOT NULL,
    --Priority nvarchar(50) , 
    Question_Date smalldatetime NOT NULL,
    Question_Type nvarchar(50) NOT NULL,
    FK_Status_Id INT, 
    FK_Client_Id INT,
    FK_Product_Id INT,
    CONSTRAINT FK_Product FOREIGN KEY (FK_Product_Id)
    REFERENCES BI.Product(Product_Id),
    --CONSTRAINT CHK_Question CHECK (Priority IN ('Urgent','High', 'Medium', 'Low')),
    CONSTRAINT CHK_Question_Type CHECK (Question_Type IN ('knowledge','Failure')), --We define 0 for knowledge or 1 for a failure
    CONSTRAINT FK_Status FOREIGN KEY (FK_Status_Id)
    REFERENCES BI.Status(Status_Id),
    CONSTRAINT FK_Client FOREIGN KEY (FK_Client_Id)
    REFERENCES BI.Client(Client_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BI.Product_Type (
    Product_Type_Id INT NOT NULL IDENTITY  PRIMARY KEY,
    Type_Name nvarchar(50) NOT NULL, --Should be a check like (Virtual platform, Scanning platfomr, Printing solution, ...)
    Description nvarchar(255) 
);

CREATE TABLE BI.Product (
    Product_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    Product_Name nvarchar(50) NOT NULL,
    FK_Product_Type_Id INT,
    CONSTRAINT FK_Product_Type FOREIGN KEY (FK_Product_Type_Id)
    REFERENCES BI.Product_Type(Product_Type_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CREATE TABLE BI.Product_Question (
--     Product_Question_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
--     FK_Product_Id INT,
--     FK_Question_Id INT,
--     CONSTRAINT FK_Product FOREIGN KEY (FK_Product_Id)
--     REFERENCES BI.Product(Product_Id),
--     CONSTRAINT FK_Question FOREIGN KEY (FK_Question_Id)
--     REFERENCES BI.Question(Question_Id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE
-- );

CREATE TABLE BI.Department (
    Department_Id INT NOT NULL IDENTITY  PRIMARY KEY,
    Department_Name nvarchar(50) NOT NULL, --Should be a check like (Support, Bizdev, Marketing, ...)
    CONSTRAINT CHK_Department CHECK (Department_Name IN ('Support', 'Bizdev', 'Marketing')),
);

CREATE TABLE BI.Employee (
    Employee_Id INT NOT NULL  IDENTITY  PRIMARY KEY,
    Employee_Name nvarchar(50),
    Employee_Last_Name nvarchar(50),
    Employee_User_Id nvarchar(50) NOT NULL,
    FK_Deparment_Id INT,
    CONSTRAINT FK_Deparment FOREIGN KEY (FK_Deparment_Id)
    REFERENCES BI.Department(Department_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BI.Answer (
    Answer_Id  INT NOT NULL  IDENTITY  PRIMARY KEY,
    Result nvarchar(500) NOT NULL,
    Qualification INT, --Should be a check like (High, Medium, Low,...)
    Answer_Date smalldatetime NOT NULL,
    FK_Question_Id INT, 
    FK_Employee_Id INT,
    CONSTRAINT CHK_Qualification CHECK (Qualification IN (0,1,2,3,4,5)),
    CONSTRAINT FK_Question_Answer FOREIGN KEY (FK_Question_Id)
    REFERENCES BI.Question(Question_Id),
    CONSTRAINT FK_Employee FOREIGN KEY (FK_Employee_Id)
    REFERENCES BI.Employee(Employee_Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);