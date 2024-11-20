--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: registration_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registration_info (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    mobile character varying(15),
    city character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registration_info OWNER TO postgres;

--
-- Name: registration_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registration_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registration_info_id_seq OWNER TO postgres;

--
-- Name: registration_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registration_info_id_seq OWNED BY public.registration_info.id;


--
-- Name: registration_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registration_info ALTER COLUMN id SET DEFAULT nextval('public.registration_info_id_seq'::regclass);


--
-- Name: registration_info registration_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registration_info
    ADD CONSTRAINT registration_info_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

