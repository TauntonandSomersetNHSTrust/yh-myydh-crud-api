SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

USE myydh_crud_api;
GO

INSERT INTO lookup.preference_type
    (preference_type)
VALUES
    ('SMS'),
    ('Email'),
    ('Phone'),
    ('Letters');
GO

INSERT INTO lookup.preference_value
    (preference_value)
VALUES
    ('yes'),
    ('no');
GO

INSERT INTO patient.preferences
    (patient_id, preference_type_id, preference_value_id, preference_priority, created)
VALUES
    (9999999999, 1, 1, 0, CURRENT_TIMESTAMP),
    (9999999999, 2, 2, 1, CURRENT_TIMESTAMP),
    (9999999999, 3, 1, 2, CURRENT_TIMESTAMP),
    (9999999999, 4, 2, 3, CURRENT_TIMESTAMP),
    (9999999998, 1, 1, 0, CURRENT_TIMESTAMP),
    (9999999998, 2, 2, 1, CURRENT_TIMESTAMP);
GO

INSERT INTO register.documents
    (GUID, fhir_id, Title, Clinic, Document_Type, Filesname, URL, Patient_Visible,
    CreatedDate, Modified, Specialty, FullPath, BaseURL, BaseSite)
VALUES
    ('YDHNHSFT-1553412538-5837', '5484125', 'App Diabetic Medicine 31 March 2021 5484125 268', 'APPOINTMENT', 'Patient Letter', 'App Diabetic Medicine 31 March 2021 5484125 268_9952d3e9-4d17-40cd-a813-e998ed71d1c9.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1553412538-5837', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Diabetic Medicine', '/sites/MedRec/Record Library 1/5484125/Medical Records/App Diabetic Medicine 31 March 2021 5484125 268_9952d3e9-4d17-40cd-a813-e998ed71d1c9.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1553412538-5843', '5484125', NULL, 'APPOINTMENT', 'Patient Letter', 'Yar Pirate Ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1553412538-5843', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, '/sites/MedRec/Record Library 1/5484125/Medical Records/Yar Pirate Ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1553412538-5845', '5484125', 'lorrem ipsum', 'APPOINTMENT', 'Patient Letter', 'Lorem ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1553412538-5845', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, '/sites/MedRec/Record Library 1/5484125/Medical Records/Lorem ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64352', '5484125', 'App Orthodontics 25 April 2016 5484125 245', 'APPOINTMENT', 'Patient Letter', 'App Orthodontics 25 April 2016 5484125 245_1e8a4159-99fa-40d1-a7ac-9a20317811cc.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64352', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Orthodontics', '/sites/MedRec/Records/5484125/Medical Records/App Orthodontics 25 April 2016 5484125 245_1e8a4159-99fa-40d1-a7ac-9a20317811cc.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64353', '5484125', 'App Orthodontics 25 April 2016 5484125 246', 'APPOINTMENT', 'Patient Letter', 'App Orthodontics 25 April 2016 5484125 246_67ee3e9d-9824-4643-8cc2-abbf668e9e75.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64353', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Orthodontics', '/sites/MedRec/Records/5484125/Medical Records/App Orthodontics 25 April 2016 5484125 246_67ee3e9d-9824-4643-8cc2-abbf668e9e75.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64354', '5484125', 'App DarkArts 27 April 2016 5484125 247', 'APPOINTMENT', 'Patient Letter', 'App DarkArts 27 April 2016 5484125 247_144a6df1-c80c-47e5-808d-d120713250d9.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64354', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'DarkArts', '/sites/MedRec/Records/5484125/Medical Records/App DarkArts 27 April 2016 5484125 247_144a6df1-c80c-47e5-808d-d120713250d9.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64356', '5484125', 'App Dark Arts 25 December 2020 5484125 249', 'APPOINTMENT', 'Patient Letter', 'App Dark Arts 25 December 2020 5484125 249_c8602c8e-fabe-44e4-8ea7-6a9b4fb9012e.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64356', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dark Arts', '/sites/MedRec/Records/5484125/Medical Records/App Dark Arts 25 December 2020 5484125 249_c8602c8e-fabe-44e4-8ea7-6a9b4fb9012e.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64361', '5484125', 'App Colorectal Surgery 20 October 2020 5484125 254', 'APPOINTMENT', 'Patient Letter', 'App Colorectal Surgery 20 October 2020 5484125 254_e9d863f9-19db-465d-8942-165f9c45dc58.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64361', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Colorectal Surgery', '/sites/MedRec/Records/5484125/Medical Records/App Colorectal Surgery 20 October 2020 5484125 254_e9d863f9-19db-465d-8942-165f9c45dc58.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1553412538-5846', '5484125', 'bacon ipsum - not visiable', 'APPOINTMENT', 'Patient Letter', 'bacon ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1553412538-5846', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, '/sites/MedRec/Record Library 1/5484125/Medical Records/bacon ipsum.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec'),
    ('YDHNHSFT-1130812521-64362', '5484125', 'App Gastroenterology 23 October 2020 5484125 255', 'APPOINTMENT', 'Patient Letter', 'App Gastroenterology 23 October 2020 5484125 255_3bab528e-1b31-49f0-937b-a18c67f0388e.pdf', 'https://notrealdomain.ydh.nhs.uk/sites/MedRec/DocIdRedir.aspx?ID=YDHNHSFT-1130812521-64362', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Gastroenterology', '/sites/MedRec/Records/5484125/Medical Records/App Gastroenterology 23 October 2020 5484125 255_3bab528e-1b31-49f0-937b-a18c67f0388e.pdf', 'https://notrealdomain.ydh.nhs.uk', '/sites/MedRec')

GO
