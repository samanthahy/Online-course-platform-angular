DROP TABLE IF EXISTS CP_ORDER CASCADE;
DROP TABLE IF EXISTS CP_ORDER_COURSE CASCADE;

DROP TABLE IF EXISTS CP_COURSE CASCADE;
DROP TABLE IF EXISTS CP_SECTION CASCADE;
DROP TABLE IF EXISTS CP_LECTURE CASCADE;
DROP TABLE IF EXISTS CP_QUIZ CASCADE;
DROP TABLE IF EXISTS CP_QUIZ_QUESTION CASCADE;
DROP TABLE IF EXISTS CP_NOTE CASCADE;
DROP TABLE IF EXISTS CP_CATEGORY CASCADE;

DROP TABLE IF EXISTS CP_USER CASCADE;
DROP TABLE IF EXISTS CP_USER_DETAIL CASCADE;
DROP TABLE IF EXISTS CP_PROFILE CASCADE;
DROP TABLE IF EXISTS CP_USER_PROFILE CASCADE;

DROP TABLE IF EXISTS CP_WISHLIST CASCADE;
DROP TABLE IF EXISTS CP_ENROLLMENT CASCADE;

DROP TABLE IF EXISTS CP_CART_ITEM CASCADE;
DROP TABLE IF EXISTS CP_SHOPPING_SESSION CASCADE;
DROP TABLE IF EXISTS CP_DISCOUNT CASCADE;
DROP TABLE IF EXISTS CP_PAYMENT CASCADE;
DROP TABLE IF EXISTS CP_REFUND CASCADE;
DROP TABLE IF EXISTS CP_REVIEW CASCADE;
DROP TABLE IF EXISTS CP_PROFILE_IMAGE CASCADE;
DROP TABLE IF EXISTS CP_COURSE_IMAGE CASCADE;
DROP TABLE IF EXISTS CP_LECTURE_VIDEO CASCADE;



DROP SEQUENCE IF EXISTS CP_ORDER_SEQ;
DROP SEQUENCE IF EXISTS CP_ORDER_COURSE_SEQ;
DROP SEQUENCE IF EXISTS CP_COURSE_SEQ;
DROP SEQUENCE IF EXISTS CP_SECTION_SEQ;
DROP SEQUENCE IF EXISTS CP_LECTURE_SEQ;
DROP SEQUENCE IF EXISTS CP_QUIZ_SEQ;
DROP SEQUENCE IF EXISTS CP_QUIZ_QUESTION_SEQ;
DROP SEQUENCE IF EXISTS CP_NOTE_SEQ;
DROP SEQUENCE IF EXISTS CP_CATEGORY_SEQ;
DROP SEQUENCE IF EXISTS CP_USER_SEQ;
DROP SEQUENCE IF EXISTS CP_USER_DETAIL_SEQ;
DROP SEQUENCE IF EXISTS CP_PROFILE_SEQ;
DROP SEQUENCE IF EXISTS CP_USER_PROFILE_SEQ;
DROP SEQUENCE IF EXISTS CP_ENROLLMENT_SEQ;
DROP SEQUENCE IF EXISTS CP_CART_ITEM_SEQ;
DROP SEQUENCE IF EXISTS CP_SHOPPING_SESSION_SEQ;
DROP SEQUENCE IF EXISTS CP_DISCOUNT_SEQ;
DROP SEQUENCE IF EXISTS CP_PAYMENT_SEQ;
DROP SEQUENCE IF EXISTS CP_REFUND_SEQ;
DROP SEQUENCE IF EXISTS CP_REVIEW_SEQ;
DROP SEQUENCE IF EXISTS CP_PROFILE_IMAGE_SEQ;
DROP SEQUENCE IF EXISTS CP_COURSE_IMAGE_SEQ;
DROP SEQUENCE IF EXISTS CP_LECTURE_VIDEO_SEQ;



--------------------------------------------------------
--  DDL for Table CP_ORDER
--------------------------------------------------------

  CREATE TABLE CP_ORDER
   (ID int, 
  PURCHASE_DATE DATE, 
  USER_ID int,
  TOTAL NUMERIC(5,2),
	ORDER_NUMBER VARCHAR(255),
   PAYMENT_TYPE VARCHAR(30)
   );
--------------------------------------------------------
--  DDL for Table CP_ORDER_COURSE
--------------------------------------------------------

  CREATE TABLE CP_ORDER_COURSE
   (ID int, 
  ORDER_ID int, 
  COURSE_ID int,
	SELLING_PRICE NUMERIC(5, 2)
   );

--------------------------------------------------------
--  DDL for Table CP_COURSE
--------------------------------------------------------

  CREATE TABLE CP_COURSE 
   (  ID int, 
  NAME VARCHAR(255),
  INSTRUCTOR_ID int,
	OVERVIEW TEXT, 
	LEARNING_OUTCOMES TEXT,
	PREREQUISITES TEXT,
	DESCRIPTION TEXT,
	RATING NUMERIC(2, 1) DEFAULT 0.0,
	CATEGORY_ID int,
	LEVEL VARCHAR(30),
	PRICE NUMERIC(5, 2), 
	IMAGE_ID int,
	DISCOUNT int NULL,
	LANGUAGE VARCHAR(30),
	STATUS VARCHAR(30)
   );


--------------------------------------------------------
--  DDL for Table CP_SECTION
--------------------------------------------------------

  CREATE TABLE CP_SECTION
   (  ID int, 
  TITLE VARCHAR(255) NOT NULL,
  COURSE_ID int
   );

--------------------------------------------------------
--  DDL for Table CP_LECTURE
--------------------------------------------------------

  CREATE TABLE CP_LECTURE
   ( ID int,
  SECTION_ID int,
  TITLE VARCHAR(255) NOT NULL,
  VIDEO_ID int,
  DURATION bigint
   );

--------------------------------------------------------
--  DDL for Table CP_QUIZ
--------------------------------------------------------
  
  CREATE TABLE CP_QUIZ
   (  ID int, 
  SECTION_ID int,
  TITLE VARCHAR(255) NOT NULL
   );


--------------------------------------------------------
--  DDL for Table CP_QUIZ_QUESTION
--------------------------------------------------------

  CREATE TABLE CP_QUIZ_QUESTION
   (  ID int,
  QUIZ_ID int, 
  QUESTION VARCHAR(255),
  CHOICE1 VARCHAR(255),
  CHOICE2 VARCHAR(255),
  CHOICE3 VARCHAR(255),
  ANSWER int CHECK (ANSWER IN (1,2,3))
   );

--------------------------------------------------------
--  DDL for Table CP_NOTE
--------------------------------------------------------

CREATE TABLE CP_NOTE
   (  ID int,
  USER_ID int,
  LECTURE_ID int,
  NOTE_TIME bigint NOT NULL,
  NOTE_CONTENT TEXT NOT NULL,
  CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
--------------------------------------------------------
--  DDL for Table CP_CATEGORY
--------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE CP_CATEGORY
   (  ID int,
  PATH LTREE,
	NAME VARCHAR(255) NOT NULL
   );

--------------------------------------------------------
--  DDL for Table CP_USER
--------------------------------------------------------

  CREATE TABLE CP_USER
   (  ID int,
    USERNAME VARCHAR(40) NOT NULL, 
  PASSWORD VARCHAR(255) NOT NULL, 
  EMAIL VARCHAR(100) NOT NULL,
	JOINED_DATE DATE,
	STATUS VARCHAR(100) DEFAULT 'Active'
   );

--------------------------------------------------------
--  DDL for Table CP_USER_DETAIL
--------------------------------------------------------

  CREATE TABLE CP_USER_DETAIL 
   (ID int, 
  FIRSTNAME VARCHAR(100),
	LASTNAME VARCHAR(100),
  PHONE VARCHAR(20), 
	OVERVIEW TEXT,
  DESCRIPTION TEXT,
  PERSONAL_LINK VARCHAR(255),
  IMAGE_ID int,
  USER_ID int,
  PAYMENT_ID int
   );
--------------------------------------------------------
--  DDL for Table CP_USER_PROFILE
--------------------------------------------------------

  CREATE TABLE CP_USER_PROFILE 
   (ID int, 
  USER_ID int, 
  PROFILE_ID int
   );
--------------------------------------------------------
--  DDL for Table CP_PROFILE
--------------------------------------------------------

  CREATE TABLE CP_PROFILE 
   (ID int, 
	ROLE VARCHAR(30)
   );

-------------------------------------------------------
--  DDL for Table CP_WISHLIST
--------------------------------------------------------

  CREATE TABLE CP_WISHLIST  
   (USER_ID int, 
   COURSE_ID int
   );


-------------------------------------------------------
--  DDL for Table CP_ENROLLMENT
--------------------------------------------------------

  CREATE TABLE CP_ENROLLMENT  
   (  ID int, 
   USER_ID int, 
   COURSE_ID int,
   PROGRESS NUMERIC(4,2) DEFAULT 0.00,
   ENROLL_DATE DATE,
   REFUND_ID int
   );

-------------------------------------------------------
--  DDL for Table CP_CART_ITEM
--------------------------------------------------------

  CREATE TABLE CP_CART_ITEM 
   (ID int, 
   SHOPPING_SESSION_ID int,
   COURSE_ID int
   );

-------------------------------------------------------
--  DDL for Table CP_SHOPPING_SESSION
--------------------------------------------------------

  CREATE TABLE CP_SHOPPING_SESSION  
   (ID int, 
   USER_ID int,
   TOTAL NUMERIC(5, 2)
   );

-------------------------------------------------------
--  DDL for Table CP_DISCOUNT
--------------------------------------------------------

  CREATE TABLE CP_DISCOUNT  
   (ID int, 
   START_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   END_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   NAME VARCHAR(100),
   DESCRIPTION VARCHAR(100),
   DISCOUNT_PERCENT DECIMAL DEFAULT 1.00
   );

-------------------------------------------------------
--  DDL for Table CP_PAYMENT
--------------------------------------------------------

  CREATE TABLE CP_PAYMENT
   (ID int, 
   USER_ID int,
   NAME_ON_CARD VARCHAR(100),
   ACCOUNT_NO VARCHAR(50),
   EXPIRY DATE
   );
-------------------------------------------------------
--  DDL for Table CP_REFUND
--------------------------------------------------------

  CREATE TABLE CP_REFUND
  
   (ID int,
   ENROLLMENT_ID int,
   REQUEST_DATE DATE,
   STATUS VARCHAR(20),
   DESCRIPTION VARCHAR(255)
   );

-------------------------------------------------------
--  DDL for Table CP_REVIEW
--------------------------------------------------------

  CREATE TABLE CP_REVIEW
  
   (ID int, 
   COURSE_ID int,
   USER_ID int,
   RATING int DEFAULT 0,
   CONTENT TEXT NOT NULL,
	CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   

-------------------------------------------------------
--  DDL for Table CP_PROFILE_IMAGE
--------------------------------------------------------

  CREATE TABLE CP_PROFILE_IMAGE
  
   (ID int, 
   USER_ID int,
   FILE_NAME VARCHAR(255),
   FILE_PATH VARCHAR(255),
	FILE_SIZE BIGINT,
	S3_OBJECT_KEY VARCHAR(255),
   UPLOAD_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

-------------------------------------------------------
--  DDL for Table CP_COURSE_IMAGE
--------------------------------------------------------

  CREATE TABLE CP_COURSE_IMAGE
  
   (ID int, 
   COURSE_ID int,
   FILE_NAME VARCHAR(255),
   FILE_PATH VARCHAR(255),
	FILE_SIZE BIGINT,
	S3_OBJECT_KEY VARCHAR(255),
   UPLOAD_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

-------------------------------------------------------
--  DDL for Table CP_LECTURE_VIDEO
--------------------------------------------------------

  CREATE TABLE CP_LECTURE_VIDEO
  
   (ID int, 
   LECTURE_ID int,
   FILE_NAME VARCHAR(255),
   FILE_PATH VARCHAR(255),
	FILE_SIZE BIGINT,
	S3_OBJECT_KEY VARCHAR(255),
   UPLOAD_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

--------------------------------------------------------
--  DDL for Sequence CP_ORDER_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_ORDER_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_ORDER_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence MSI_ORDER_PRODUCT_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_ORDER_COURSE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_ORDER_COURSE_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_COURSE_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_COURSE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_COURSE_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_SECTION_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_SECTION_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_SECTION_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_LECTURE_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_LECTURE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_LECTURE_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Sequence CP_QUIZ_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_QUIZ_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_QUIZ_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_QUIZ_QUESTION_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_QUIZ_QUESTION_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_QUIZ_QUESTION_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Sequence CP_NOTE_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_NOTE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_NOTE_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Sequence CP_CATEGORY_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_CATEGORY_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_CATEGORY_SEQ
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Sequence CP_USER_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_USER_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_USER_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_USER_DETAIL_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_USER_DETAIL_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_USER_DETAIL_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_USER_PROFILE_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_USER_PROFILE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_USER_PROFILE_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_ENROLLMENT_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_ENROLLMENT_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_ENROLLMENT_SEQ
    OWNER TO postgres;


--------------------------------------------------------
--  DDL for Sequence CP_CART_ITEM_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_CART_ITEM_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_CART_ITEM_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Sequence CP_SHOPPING_SESSION_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_SHOPPING_SESSION_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_SHOPPING_SESSION_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Sequence CP_DISCOUNT_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_DISCOUNT_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_DISCOUNT_SEQ
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Sequence CP_PAYMENT_SEQ
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_PAYMENT_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_PAYMENT_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_REFUND_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_REFUND_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_REFUND_SEQ
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Sequence CP_REVIEW_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_REVIEW_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_REVIEW_SEQ
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Sequence CP_PROFILE_IMAGE_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_PROFILE_IMAGE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_PROFILE_IMAGE_SEQ
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Sequence CP_COURSE_IMAGE_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_COURSE_IMAGE_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_COURSE_IMAGE_SEQ
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Sequence CP_LECTURE_VIDEO_SEQ;
--------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.CP_LECTURE_VIDEO_SEQ
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.CP_LECTURE_VIDEO_SEQ
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Index CP_ORDER_PK
--------------------------------------------------------
ALTER TABLE CP_ORDER ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_ORDER_COURSE_PK
--------------------------------------------------------
ALTER TABLE CP_ORDER_COURSE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_COURSE_PK
--------------------------------------------------------
ALTER TABLE CP_COURSE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_SECTION_PK
--------------------------------------------------------
ALTER TABLE CP_SECTION ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_LECTURE_PK
--------------------------------------------------------
ALTER TABLE CP_LECTURE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_QUIZ_PK
--------------------------------------------------------
ALTER TABLE CP_QUIZ ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_QUIZ_QUESTION_PK
--------------------------------------------------------
ALTER TABLE CP_QUIZ_QUESTION ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_NOTE_PK
--------------------------------------------------------
ALTER TABLE CP_NOTE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_CATEGORY_PK
--------------------------------------------------------
ALTER TABLE CP_CATEGORY ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_USER_PK
--------------------------------------------------------
ALTER TABLE CP_USER ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_USER_DETAIL_PK
--------------------------------------------------------
ALTER TABLE CP_USER_DETAIL ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_PROFILE_PK
--------------------------------------------------------
ALTER TABLE CP_PROFILE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_USER_PROFILE_PK
--------------------------------------------------------
ALTER TABLE CP_USER_PROFILE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_WISHLIST_PK
--------------------------------------------------------
ALTER TABLE CP_WISHLIST ADD PRIMARY KEY (USER_ID, COURSE_ID);
--------------------------------------------------------
--  DDL for Index CP_ENROLLMENT_PK
--------------------------------------------------------
ALTER TABLE CP_ENROLLMENT ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_CART_ITEM_PK
--------------------------------------------------------
ALTER TABLE CP_CART_ITEM ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_SHOPPING_SESSION_PK
--------------------------------------------------------
ALTER TABLE CP_SHOPPING_SESSION ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_DISCOUNT_PK
--------------------------------------------------------
ALTER TABLE CP_DISCOUNT ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_PAYMENT_PK
--------------------------------------------------------
ALTER TABLE CP_PAYMENT ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_REFUND_PK
--------------------------------------------------------
ALTER TABLE CP_REFUND ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_REVIEW_PK
--------------------------------------------------------
ALTER TABLE CP_REVIEW ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_PROFILE_IMAGE_PK
--------------------------------------------------------
ALTER TABLE CP_PROFILE_IMAGE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_COURSE_IMAGE_PK
--------------------------------------------------------
ALTER TABLE CP_COURSE_IMAGE ADD PRIMARY KEY (ID);
--------------------------------------------------------
--  DDL for Index CP_LECTURE_VIDEO_PK
--------------------------------------------------------
ALTER TABLE CP_LECTURE_VIDEO ADD PRIMARY KEY (ID);

--------------------------------------------------------
--  DDL for Trigger Function CP_ORDER_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ORDER_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_ORDER_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.ORDER_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_ORDER_COURSE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ORDER_COURSE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_ORDER_COURSE_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.ORDER_COURSE_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_COURSE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.COURSE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_COURSE_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.COURSE_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_SECTION_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.SECTION_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_SECTION_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.SECTION_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_LECTURE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.LECTURE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_LECTURE_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.LECTURE_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_QUIZ_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.QUIZ_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_QUIZ_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.QUIZ_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_QUIZ_QUESTION_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.QUIZ_QUESTION_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_QUIZ_QUESTION_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.QUIZ_QUESTION_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_NOTE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.NOTE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_NOTE_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.NOTE_ID()
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Trigger Function CP_CATEGORY_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.CATEGORY_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_CATEGORY_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.CATEGORY_ID()
    OWNER TO postgres;
	
--------------------------------------------------------
--  DDL for Trigger Function CP_USER_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.USER_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_USER_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.USER_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_USER_DETAIL_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.USER_DETAIL_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_USER_DETAIL_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.USER_DETAIL_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_USER_PROFILE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.USER_PROFILE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_USER_PROFILE_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.USER_PROFILE_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_ENROLLMENT_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ENROLLMENT_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   New.id:=nextval('CP_ENROLLMENT_SEQ');
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.ENROLLMENT_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_CART_ITEM_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.CART_ITEM_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_CART_ITEM_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.CART_ITEM_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_SHOPPING_SESSION_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.SHOPPING_SESSION_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_SHOPPING_SESSION_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.SHOPPING_SESSION_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_DISCOUNT_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.DISCOUNT_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_DISCOUNT_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.DISCOUNT_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_PAYMENT_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.PAYMENT_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_PAYMENT_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.PAYMENT_ID()
    OWNER TO postgres;	

--------------------------------------------------------
--  DDL for Trigger Function CP_REFUND_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.REFUND_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_REFUND_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.REFUND_ID()
    OWNER TO postgres;
--------------------------------------------------------
--  DDL for Trigger Function CP_REVIEW_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.REVIEW_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_REVIEW_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.REVIEW_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_PROFILE_IMAGE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.PROFILE_IMAGE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_PROFILE_IMAGE_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.PROFILE_IMAGE_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_COURSE_IMAGE_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.COURSE_IMAGE_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_COURSE_IMAGE_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.COURSE_IMAGE_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_LECTURE_VIDEO_TRG
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.LECTURE_VIDEO_ID()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 BEGIN
   IF New.id IS null THEN
   New.id:=nextval('CP_LECTURE_VIDEO_SEQ');
   END IF;
   Return NEW;
 END;
 
$BODY$;

ALTER FUNCTION public.LECTURE_VIDEO_ID()
    OWNER TO postgres;

--------------------------------------------------------
--  DDL for Trigger Function CP_ORDER_TRG
--------------------------------------------------------
CREATE TRIGGER cp_order_id_gen_trg
    BEFORE INSERT
    ON public.CP_ORDER
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.order_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_ORDER_COURSE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_order_course_id_gen_trg
    BEFORE INSERT
    ON public.CP_ORDER_COURSE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.order_course_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_COURSE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_course_id_gen_trg
    BEFORE INSERT
    ON public.CP_COURSE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.course_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_SECTION_TRG
--------------------------------------------------------
CREATE TRIGGER cp_section_id_gen_trg
    BEFORE INSERT
    ON public.CP_SECTION
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.section_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_LECTURE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_lecture_id_gen_trg
    BEFORE INSERT
    ON public.CP_LECTURE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.lecture_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_QUIZ_TRG
--------------------------------------------------------
CREATE TRIGGER cp_quiz_id_gen_trg
    BEFORE INSERT
    ON public.CP_QUIZ
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.quiz_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_QUIZ_QUESTION_TRG
--------------------------------------------------------
CREATE TRIGGER cp_quiz_question_id_gen_trg
    BEFORE INSERT
    ON public.CP_QUIZ_QUESTION
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.quiz_question_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_NOTE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_note_id_gen_trg
    BEFORE INSERT
    ON public.CP_NOTE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.note_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_CATEGORY_TRG
--------------------------------------------------------
CREATE TRIGGER cp_category_id_gen_trg
    BEFORE INSERT
    ON public.CP_CATEGORY
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.category_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_USER_TRG
--------------------------------------------------------
CREATE TRIGGER cp_user_id_gen_trg
    BEFORE INSERT
    ON public.CP_USER
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.user_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_USER_DETAIL_TRG
--------------------------------------------------------
CREATE TRIGGER cp_user_detail_id_gen_trg
    BEFORE INSERT
    ON public.CP_USER_DETAIL
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.user_detail_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_USER_PROFILE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_user_profile_id_gen_trg
    BEFORE INSERT
    ON public.CP_USER_PROFILE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.user_profile_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_ENROLLMENT_TRG
--------------------------------------------------------
CREATE TRIGGER cp_enrollment_id_gen_trg
    BEFORE INSERT
    ON public.CP_ENROLLMENT
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.enrollment_id();
--------------------------------------------------------
--  DDL for Trigger Function CP_CART_ITEM_TRG
--------------------------------------------------------
CREATE TRIGGER cp_cart_item_id_gen_trg
    BEFORE INSERT
    ON public.CP_CART_ITEM
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.cart_item_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_SHOPPING_SESSION_TRG
--------------------------------------------------------
CREATE TRIGGER cp_shopping_session_id_gen_trg
    BEFORE INSERT
    ON public.CP_SHOPPING_SESSION
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.shopping_session_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_DISCOUNT_TRG
--------------------------------------------------------
CREATE TRIGGER cp_discount_id_gen_trg
    BEFORE INSERT
    ON public.CP_DISCOUNT
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.discount_id();
	
--------------------------------------------------------
--  DDL for Trigger Function CP_PAYMENT_TRG
--------------------------------------------------------
CREATE TRIGGER cp_payment_id_gen_trg
    BEFORE INSERT
    ON public.CP_PAYMENT
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.payment_id();
--------------------------------------------------------
--  DDL for Trigger Function CP_REFUND_TRG
--------------------------------------------------------
CREATE TRIGGER cp_refund_id_gen_trg
    BEFORE INSERT
    ON public.CP_REFUND
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.refund_id();

--------------------------------------------------------
--  DDL for Trigger Function CP_REVIEW_TRG
--------------------------------------------------------
CREATE TRIGGER cp_review_id_gen_trg
    BEFORE INSERT
    ON public.CP_REVIEW
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.review_id();
	
--------------------------------------------------------
--  DDL for Trigger Function CP_PROFILE_IMAGE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_profile_image_id_gen_trg
    BEFORE INSERT
    ON public.CP_PROFILE_IMAGE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.profile_image_id();
	
--------------------------------------------------------
--  DDL for Trigger Function CP_COURSE_IMAGE_TRG
--------------------------------------------------------
CREATE TRIGGER cp_course_image_id_gen_trg
    BEFORE INSERT
    ON public.CP_COURSE_IMAGE
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.course_image_id();
	
--------------------------------------------------------
--  DDL for Trigger Function CP_LECTURE_VIDEO_TRG
--------------------------------------------------------
CREATE TRIGGER cp_lecture_video_id_gen_trg
    BEFORE INSERT
    ON public.CP_LECTURE_VIDEO
    FOR EACH ROW
    WHEN (New.id is null)
    EXECUTE FUNCTION public.lecture_video_id();
------------------------------------------------------------
------------------------------------------------------------

