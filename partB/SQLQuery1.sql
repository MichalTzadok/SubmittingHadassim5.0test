-- Persons ��� 1: ����� ���� 
CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name NVARCHAR(50),
    Family_Name NVARCHAR(50),
    Gender NVARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);

-- ��� 2: ����� ������ ������
INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, N'����', N'���', N'���', NULL, NULL, 2),
(2, N'����', N'���', N'����', NULL, NULL, 1),
(3, N'���', N'���', N'���', 1, 2, NULL),
(4, N'����', N'���', N'����', 1, 2, NULL),
(5, N'���', N'���', N'���', NULL, NULL, NULL);

-- ��� 3: ����� ���� FamilyTree
CREATE TABLE FamilyTree (
    Person_Id INT NOT NULL,
    Relative_Id INT NOT NULL,
    Connection_Type NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Family PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    CONSTRAINT FK_Person FOREIGN KEY (Person_Id) REFERENCES Persons(Person_Id),
    CONSTRAINT FK_Relative FOREIGN KEY (Relative_Id) REFERENCES Persons(Person_Id)
);

-- ��� 4: ����� ����� �������� ��� ����� ��������

-- ��
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, N'��'
FROM Persons p
WHERE Father_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Father_Id AND f.Connection_Type = N'��'
);

-- ��
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, N'��'
FROM Persons p
WHERE Mother_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Mother_Id AND f.Connection_Type = N'��'
);

-- ��/�� ���
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE Gender WHEN N'���' THEN N'��' ELSE N'��' END
FROM Persons p
WHERE Father_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Father_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type = 
            CASE p.Gender WHEN N'���' THEN N'��' ELSE N'��' END
);

-- ��/�� ���
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE Gender WHEN N'���' THEN N'��' ELSE N'��' END
FROM Persons p
WHERE Mother_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Mother_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type = 
            CASE p.Gender WHEN N'���' THEN N'��' ELSE N'��' END
);

-- �� ��� / �� ���
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id,
       CASE Gender WHEN N'���' THEN N'�� ���' ELSE N'�� ���' END
FROM Persons p
WHERE Spouse_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Person_Id AND f.Relative_Id = p.Spouse_Id AND f.Connection_Type =
            CASE p.Gender WHEN N'���' THEN N'�� ���' ELSE N'�� ���' END
);

--( ����� ��� ��� ����� (����� ����
UPDATE p2
SET Spouse_Id = p1.Person_Id
FROM Persons p1
JOIN Persons p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id IS NULL OR p2.Spouse_Id <> p1.Person_Id;

-- ����� ��� �� ��� ���� ����
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Spouse_Id, Person_Id,
       CASE Gender WHEN N'���' THEN N'�� ���' ELSE N'�� ���' END
FROM Persons p
WHERE Spouse_Id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p.Spouse_Id AND f.Relative_Id = p.Person_Id AND f.Connection_Type =
            CASE p.Gender WHEN N'���' THEN N'�� ���' ELSE N'�� ���' END
);

-- ���� ������
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE p2.Gender WHEN N'���' THEN N'��' ELSE N'����' END
FROM Persons p1
JOIN Persons p2 ON p1.Father_Id = p2.Father_Id AND p1.Mother_Id = p2.Mother_Id
WHERE p1.Person_Id <> p2.Person_Id
  AND NOT EXISTS (
      SELECT 1 FROM FamilyTree f
      WHERE f.Person_Id = p1.Person_Id AND f.Relative_Id = p2.Person_Id AND f.Connection_Type =
            CASE p2.Gender WHEN N'���' THEN N'��' ELSE N'����' END
);

-- ��� 5: ����� �����
SELECT * FROM FamilyTree ORDER BY Person_Id;
