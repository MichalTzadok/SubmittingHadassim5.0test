-- Persons שלב 1: יצירת טבלת 
CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name NVARCHAR(50),
    Family_Name NVARCHAR(50),
    Gender NVARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);

-- שלב 2: הכנסת נתונים לדוגמה
INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, N'יוסי', N'כהן', N'זכר', NULL, NULL, 2),
(2, N'רותי', N'כהן', N'נקבה', NULL, NULL, 1),
(3, N'דני', N'כהן', N'זכר', 1, 2, NULL),
(4, N'מירי', N'כהן', N'נקבה', 1, 2, NULL),
(5, N'אבי', N'לוי', N'זכר', NULL, NULL, NULL);

-- שלב 3: יצירת טבלת FamilyTree
CREATE TABLE FamilyTree (
    Person_Id INT NOT NULL,
    Relative_Id INT NOT NULL,
    Connection_Type NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Family PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    CONSTRAINT FK_Person FOREIGN KEY (Person_Id) REFERENCES Persons(Person_Id),
    CONSTRAINT FK_Relative FOREIGN KEY (Relative_Id) REFERENCES Persons(Person_Id)
);

-- שלב 4: הוספת קשרים משפחתיים תוך מניעת כפילויות

-- אב
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, N'אב'
FROM Persons p
WHERE Father_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Father_Id AND f.Connection_Type = N'אב'
);

-- אם
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, N'אם'
FROM Persons p
WHERE Mother_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Mother_Id AND f.Connection_Type = N'אם'
);

-- בן/בת לאב
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE Gender WHEN N'זכר' THEN N'בן' ELSE N'בת' END
FROM Persons p
WHERE Father_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Father_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type = 
            CASE p.Gender WHEN N'זכר' THEN N'בן' ELSE N'בת' END
);

-- בן/בת לאם
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE Gender WHEN N'זכר' THEN N'בן' ELSE N'בת' END
FROM Persons p
WHERE Mother_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Mother_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type = 
            CASE p.Gender WHEN N'זכר' THEN N'בן' ELSE N'בת' END
);

-- בן זוג / בת זוג
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id,
       CASE Gender WHEN N'זכר' THEN N'בת זוג' ELSE N'בן זוג' END
FROM Persons p
WHERE Spouse_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Spouse_Id AND f.Connection_Type =
            CASE p.Gender WHEN N'זכר' THEN N'בת זוג' ELSE N'בן זוג' END
);

--( השלמת בני זוג חסרים (כיוון הפוך
UPDATE p2
SET Spouse_Id = p1.Person_Id
FROM Persons p1
JOIN Persons p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id IS NULL OR p2.Spouse_Id <> p1.Person_Id;

-- הוספת קשר בן זוג מהצד השני
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Spouse_Id, Person_Id,
       CASE Gender WHEN N'זכר' THEN N'בת זוג' ELSE N'בן זוג' END
FROM Persons p
WHERE Spouse_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Spouse_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type =
            CASE p.Gender WHEN N'זכר' THEN N'בן זוג' ELSE N'בת זוג' END
);

-- אחים ואחיות
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE p2.Gender WHEN N'זכר' THEN N'אח' ELSE N'אחות' END
FROM Persons p1
JOIN Persons p2 ON p1.Father_Id = p2.Father_Id AND p1.Mother_Id = p2.Mother_Id
WHERE p1.Person_Id <> p2.Person_Id
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p1.Person_Id AND f.Relative_Id = p2.Person_Id AND f.Connection_Type =
            CASE p2.Gender WHEN N'זכר' THEN N'אח' ELSE N'אחות' END
);

-- שלב 5: תצוגה סופית
SELECT * FROM FamilyTree ORDER BY Person_Id;
