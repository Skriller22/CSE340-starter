--Insert tony stark account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
    VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronm@n',
    );
--Select all admin accounts -- Use to verify accounts before and after update
SELECT * FROM public.account
WHERE account_type = 'Admin';
--Modify tony stark account to be admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
--Delete tony stark account
DELETE FROM public.account WHERE account_email = 'tony@starkent.com';
--Validate deletion -- Use to verify
SELECT * FROM public.account
WHERE account_type = 'Admin';
--Modify GM Hummer description
SELECT REPLACE(inv_description, 'small interiors', 'a huge interior')
FROM public.inventory
WHERE inv_model = 'Hummer' AND inv_make = 'GM';
--Query to select all sporty cars
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
--Update inventory paths to use "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
--Veridy path and description updates
SELECT inv_make, inv_model, inv_image, inv_thumbnail, inv_description
FROM public.inventory
WHERE inv_make IN ('GM', 'Chevrolet');
