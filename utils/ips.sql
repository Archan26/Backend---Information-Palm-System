-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: ipsirma
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `admin_name` varchar(30) NOT NULL,
  `admin_contact` bigint NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_id_UNIQUE` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Archan Parmar',9876543210),(2,'Mandip Bhingaradiya',9753186420);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_login`
--

DROP TABLE IF EXISTS `admin_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_login` (
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `admin_id` int NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `admin_id_idx` (`admin_id`),
  CONSTRAINT `admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_login`
--

LOCK TABLES `admin_login` WRITE;
/*!40000 ALTER TABLE `admin_login` DISABLE KEYS */;
INSERT INTO `admin_login` VALUES ('archan26','$2b$05$1JOovMY6NeZyJs68wLtsGOCR6H80WHpy3/zfuEY926jwubZusS2M6',1),('mandip10','$2b$05$vChnUhYmYxG79wr1AAiPQOHJicm42Vzu9TlcJZrlLWftztuPQ5.Jq',2);
/*!40000 ALTER TABLE `admin_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `book_id` int NOT NULL,
  `book_name` varchar(150) NOT NULL,
  `book_author` varchar(100) NOT NULL,
  `cat_id` int NOT NULL,
  `grade_id` int NOT NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `book_id_UNIQUE` (`book_id`),
  KEY `fk_cat_id1_idx` (`cat_id`),
  KEY `fk_grade_id1_idx` (`grade_id`),
  CONSTRAINT `fk_cat_id1` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`cat_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_grade_id1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`grade_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Std-1 Kalkaliyo - Gujarati Second Language.pdf','GSEB GUJARATI',1,1),(2,'Std-1 Ganit Gammat -Mathematics_Gujarati Medium.pdf','GSEB GUJARATI',1,1),(3,'Std1_GujMed_Kalrav_Sem1.pdf','GSEB GUJARATI',1,1),(4,'Std1_GujMed_Kalrav_Sem2.pdf','GSEB GUJARATI',1,1),(5,'Std2_GujMed_Kallol_Sem1.pdf','GSEB GUJARATI',1,2),(6,'Std2_GujMed_Kallol_Sem2.pdf','GSEB GUJARATI',1,2),(7,'Std2_GujMed_Koojan_Sem1.pdf','GSEB GUJARATI',1,2),(8,'Std2_GujMed_Koojan_Sem2.pdf','GSEB GUJARATI',1,2),(9,'Std3_GujMed_Gujarati_Sem1Sem2.pdf','GSEB GUJARATI',1,3),(10,'Std3_GujMed_Maths_Sem1Sem2.pdf','GSEB GUJARATI',1,3),(11,'Std3_GujMed_ParyavaranMariAaspas_Sem1Sem2.pdf','GSEB GUJARATI',1,3),(12,'Std4_GujMed_English_Sem1Sem2.pdf','GSEB GUJARATI',1,4),(13,'Std4_GujMed_Gujarati_Sem1Sem2.pdf','GSEB GUJARATI',1,4),(14,'Std4_GujMed_Hindi_Sem2.pdf','GSEB GUJARATI',1,4),(15,'Std4_GujMed_Maths_Sem1Sem2.pdf','GSEB GUJARATI',1,4),(16,'Std4_GujMed_ParyavaranAmariAaspas_Sem1Sem2.pdf','GSEB GUJARATI',1,4),(17,'Std5_GujMed_English_Sem1Sem2.pdf','GSEB GUJARATI',1,5),(18,'Heidi.pdf','Johanna Spyri',3,2),(19,'My Father\'s Dragon.pdf','Ruth Stiles Gannett',3,4),(20,'The Happy Prince and Other Tales.pdf','Oscar Wilde',3,1),(21,'The Tale of Peter Rabbit.pdf','Beatrix Potter',3,3),(22,'Fairy Tales.pdf','Grimm, The Brothers',3,1),(23,'Jungle Book.pdf',' Rudyard Kipling',3,6),(24,'Peter Pan.pdf',' J.M. Barrie',3,7),(25,'The Wind in the Willows.pdf','Louisa May Alcott',3,8),(26,'The magic City.pdf','E. Nesbit',3,9),(27,'The Phoenix and the Carpet.pdf','E. Nesbit',3,10),(28,'The Adventures of Sherlock Holmes.pdf','Arthur Conan Doyle',3,11),(29,'A princess of Mars.pdf','Edgar Rice Burroughs',3,12),(30,'Tarzan and the Golden Lion.pdf','Edgar Rice Burroughs',3,10),(31,'Black Beauty.pdf','Anna Sewell',3,7),(32,'The Pink Fairy Book.pdf',' Andrew Lang',3,10);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `cat_id` int NOT NULL,
  `cat_name` varchar(25) NOT NULL,
  PRIMARY KEY (`cat_id`),
  UNIQUE KEY `cat_id_UNIQUE` (`cat_id`),
  UNIQUE KEY `cat_name_UNIQUE` (`cat_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (0,'-'),(3,'Fiction'),(2,'Referencebook'),(1,'Textbook');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_info`
--

DROP TABLE IF EXISTS `device_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_info` (
  `device_id` int NOT NULL,
  `unique_id` varchar(15) NOT NULL,
  `device_status` int DEFAULT '0',
  `sv_id` int NOT NULL,
  PRIMARY KEY (`device_id`),
  UNIQUE KEY `unique_id_UNIQUE` (`unique_id`),
  UNIQUE KEY `device_id_UNIQUE` (`device_id`),
  KEY `fk_sv_id_idx` (`sv_id`),
  CONSTRAINT `fk1_sv_id` FOREIGN KEY (`sv_id`) REFERENCES `supervisors` (`sv_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_info`
--

LOCK TABLES `device_info` WRITE;
/*!40000 ALTER TABLE `device_info` DISABLE KEYS */;
INSERT INTO `device_info` VALUES (1,'688009897657667',1,11),(2,'596843750938457',1,11),(3,'348579348579888',1,4),(4,'932847595896985',1,11),(5,'895679458675877',0,4),(6,'123456789123456',0,2),(7,'796248962478963',1,11),(8,'447623562335265',1,11),(9,'789456123123624',0,11),(10,'165952569695538',0,11);
/*!40000 ALTER TABLE `device_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `grade_id` int NOT NULL,
  `standard` varchar(10) NOT NULL,
  `level_id` int DEFAULT NULL,
  PRIMARY KEY (`grade_id`),
  UNIQUE KEY `grade_id_UNIQUE` (`grade_id`),
  UNIQUE KEY `standard_UNIQUE` (`standard`),
  KEY `fk_level_id_idx` (`level_id`),
  CONSTRAINT `fk_level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`level_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (0,'-',NULL),(1,'1',1),(2,'2',1),(3,'3',1),(4,'4',1),(5,'5',1),(6,'6',2),(7,'7',2),(8,'8',2),(9,'9',2),(10,'10',3),(11,'11',3),(12,'12',3);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `id_increment`
--

DROP TABLE IF EXISTS `id_increment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `id_increment` (
  `tablename` varchar(20) NOT NULL,
  `max_number` int NOT NULL,
  PRIMARY KEY (`tablename`),
  UNIQUE KEY `tablename_UNIQUE` (`tablename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `id_increment`
--

LOCK TABLES `id_increment` WRITE;
/*!40000 ALTER TABLE `id_increment` DISABLE KEYS */;
INSERT INTO `id_increment` VALUES ('books',32),('categories',5),('device',10),('grades',12),('institutes',4),('messages',2),('students',65),('supervisors',11);
/*!40000 ALTER TABLE `id_increment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutes`
--

DROP TABLE IF EXISTS `institutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institutes` (
  `inst_id` int NOT NULL,
  `inst_name` varchar(80) NOT NULL,
  `inst_address` varchar(200) NOT NULL,
  `inst_contact` varchar(12) NOT NULL,
  PRIMARY KEY (`inst_id`),
  UNIQUE KEY `inst_id_UNIQUE` (`inst_id`),
  UNIQUE KEY `inst_name_UNIQUE` (`inst_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutes`
--

LOCK TABLES `institutes` WRITE;
/*!40000 ALTER TABLE `institutes` DISABLE KEYS */;
INSERT INTO `institutes` VALUES (0,'-','-','-'),(1,'Charusat University','Changa, Anand, Gujarat','02697-265011'),(2,'Birla Vishwakarma Mahavidhyalaya','Vidhyanagar Anand','02692-230104'),(3,'Institute of Rural Management','Anand','02692-260391'),(4,'Parul University','Anand','02692-220281');
/*!40000 ALTER TABLE `institutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `level_id` int NOT NULL,
  `grade_from` int NOT NULL,
  `grade_to` int NOT NULL,
  PRIMARY KEY (`level_id`),
  UNIQUE KEY `level_id_UNIQUE` (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,1,5),(2,6,9),(3,10,12);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_login`
--

DROP TABLE IF EXISTS `student_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_login` (
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `std_id` int NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `std_id_idx` (`std_id`),
  CONSTRAINT `std_id` FOREIGN KEY (`std_id`) REFERENCES `students` (`std_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_login`
--

LOCK TABLES `student_login` WRITE;
/*!40000 ALTER TABLE `student_login` DISABLE KEYS */;
INSERT INTO `student_login` VALUES ('aakashpatel','$2b$10$zpFmr60GtTV5PR/GT2h.deVh9gT3foi2GoVtBUFgRRLY7zfyAtbWi',22),('aashaypandya','$2b$10$IOI9/lYHTfEyEs2hyp4ctOv1W9yk5SyC929wswsEbS0hZihc8cFB2',21),('aayushipatel','$2b$10$7h9k7sga4xS2rffR9J4MIuaqg34H8sfZdvpWwrHNJef17iDtmn4HO',23),('abhisheksapariya','$2b$10$IATrbdlCJzNvLvQZ4pVy..eGJaiLsPygDykuEz5/L0XQ1zSUseuPa',19),('akshatshah','$2b$10$5TZdujC83X1DLPDGckTIOej6j8ckPVQ0G7.oQW4URuoedPksjKAxK',37),('anushkasandesara','$2b$10$8JXuyOki1QzY6Top9FxbMeaBoWQ.YFbRYcA5DHTEWzMJ6MXnbkfVm',35),('chiragjethva','$2b$10$yDCjMI.kSY7itAbH8UjkUuPqQ..a9R3gBJh0T.tKhuqY2tKhN3cjK',8),('darshishah','$2b$10$qL5fXKNRmQiBHGSbZ73sIeiIkn2YMljLwiQIfQy8CwCE7A19bVsCG',38),('devchangela','$2b$10$FkIXOJLcuObl15qpb0ZLl.zK7REPeBfxTBNcasgqPRZ/yi5AZ6MTW',57),('dharamlokhandwala','$2b$10$y0ixVHxaZ2cvXhHnJ0Cy7.HNZ/OEiQj1nRxoGzGv3Lr8KjMTGarMG',11),('dharapatel','$2b$10$b.388he/DrR87eSn4Q4E/Ob/vakLzUUiEe4x9D6BRhzqwyv8EWrc.',4),('dharmikpatel','$2b$10$l62TqTmVAAOp8zNAot4ykuXG0dq/74kQVKyJGhwdy5qZ8P7YBi0Ra',26),('dhruvishah','$2b$10$iCLxWSA/wjs7O2LDs37AVOBknwbGXf5vBf4pvO2XjsmJGtnyFthda',36),('garvitgupta','$2b$10$qbDGwKeqrT/9v9k5qPrb1OAnjQ0P77K4Jly5WXiyep9Q7j4y7e6CC',49),('hansalparmar','$2b$10$dq2MUCJKVLuiejHmgTQOremL0GOFymQ4uLULOCr8iCC.P8MU9d.4.',1),('hinelmistry','$2b$10$pLPnlhii9P6HEpZGBlYtZO8I.Wwwv8QHeqFrnZvtMJKv25TzwgAJW',6),('hussainsaddikot','$2b$10$hCu5UEBoE5zcnvLATxLyf.SFoFLV2kzKhzWsT7x9SQKAFTAh7EKR2',17),('jainilgupta.4DsP','$2b$10$erJ5HCtuni.07Ga7eCDrZeufdGfjzDthMbv1mOtIhZ/RcbLrbhZyy',62),('jaydesai','$2b$10$e0vKuYL3FwBcsKnwN6yqDOapBhrsL/D1UiENfkYmkLCdPOFy4ZCs2',50),('jaykhatri','$2b$10$z68wcgHoda6fXRkB2RjDJOom574yEZO8M/j4uN2LRNyavdQvf462S',14),('kalpitmachhi','$2b$10$xdlHLNwyu0erfT6X13dkceDMnzs7AVgPjIVMqqG5loMrgyYwUnkHS',13),('kapilbhatt','$2b$10$Ak/ZaJ0/mI981U.g4wxnSuJj8riEHYXUeMWm4tiSXlsnmcMmbexLm',55),('karanpatel','$2b$10$2g.8YQoF2Y40fznK73Qdje9u3KySwLghnDcavn6hc9jcM8M3OPADW',54),('kathanshah','$2b$10$8qhYLXjBTU7De5T7EVSdSeKJOCtfWdtIDpVy.41HInHPXg.TmivSa',46),('keyurtalati','$2b$10$Qk3ZqzIVwOuGXY7uI7tWxegTLqXuvAseLuW9G6F.AoRKTCBl/MeBW',47),('lovepatel','$2b$10$0675MCUnUtagDwLJIUbDXeDr/WWm4eX.kDDGHr2XKQdhdzFffK336',39),('manthanshah','$2b$10$NrXLHLI0hcOXReQrnFN5GeWXYURT.m/pZpErH8RyO/Gji/XoYERXi',16),('meetsuthar','$2b$10$u1UIXiiMujVLZTOB3euMU.FyExrTEOy9zY6HMpwbrRc3P9EuooR0e',48),('meghpandya','$2b$10$xy.XqAwfdGaetLnfQGZtSO3FQ/AIBk8AtgxMf8on9qs.2s9x1e3ci',25),('mihirpatel','$2b$10$5OyBo15.3IsYsZnS/fI3pe09q0QsqyWu1/ASponCi5LUznnHQrN/G',24),('milindshah','$2b$10$zSIGrLORwBuWUtMn7lfGAu.fsvIVZ02VM2HFf0hABYAAgk2mnCrce',52),('naimishghevariya','$2b$10$3DZvz5RHq8T5QXMkMlXdyu7LwjKQVa5tRW1t3EGHc83gXnLZj8.6m',7),('namratapatel','$2b$10$vLGoTolqMsischaE0FqANesPcBu.Ei.tKA3s40S8WeqjJiBxpSrpK',34),('nandinichovatiya','$2b$10$xv.MFlEQEreNk9Sy/6op1.chqhtfyuYw8CQHwUK82tMIDOH7SRGcS',30),('nehasajnani','$2b$10$doObm1P1EbZvbNw/7Op3A.FN4AwAjtXnyKbcazg6D12CdDO0m7i7G',60),('nimeshitaliya','$2b$10$abA5Jrw3iYOrMWLqrMxBeOL/R0WtbR3r09keXmBsNoHntsrCKZsB2',40),('nisargpatel','$2b$10$fk0543IUx4xN3IeQHGHWtezbbYorTw..edVd0IulYNPd6HvB8woQO',41),('nishiparmar.r8z5','$2b$10$1Cmn8gk7fRBY.i8V0E.hbeuHz4nlK.jutU.grnWLQufNPqUee9ReO',65),('nishipatel','$2b$10$XBklR/IDwMtnKKgpAjLn4.cPwiafT1RENL3VbK73qxAigNBYiR/mi',5),('poojandharaiya','$2b$10$Z5/ZlQ7a6VkCZ4yE4NTBVOAFhibMVYn3qnmSD91XGZ8UxluIuGwbO',15),('preetshah','$2b$10$FwVNvb556kwtxwsaI3pzO.KaiLctWjwDhXER35UqaSrmo9j1Rl1Ve',18),('priyalamin','$2b$10$MrUpb8TviADh/bfVAwjvie3McaIK/QrDVTuVZrb5eXqOm2QzWWJS.',28),('priyankshah','$2b$10$S3E8E7NuihuOGIYis1Rz7e.VjF.GKqKQ8OcRXbnn0epSoPim9C.Di',12),('rahilshah','$2b$10$2wcGqaFSVAxFzMFw9w2jrezp73.slfKiNzG1PUn5oYhpdtVZiv4LO',3),('rahulpatel.yakc','$2b$10$OYhKT861UjsbPztSwwVIW.bEbpNjp7CpTtDDjM.jrFDbUE9d8vGwK',64),('richashah','$2b$10$4nrcjcTQjwiPYz6dDU4VKeVML1hLfeF1yIqIUgoPsbtbiNE3fiMHK',20),('ridhhipatel','$2b$10$dZw/2Bn09ew/RXsfYRd7muC6NeiRFaDkO14Y.jevAgMUsYH7.pE4K',44),('riyaintwala','$2b$10$nHKtxDKkEbOXgnneqww.RusOFWiCFXh1mMasVJwVZh2zuBNZKWliW',9),('rohanjethloja','$2b$10$5a8oLdvI27/apBVYUHj//OkENFd8ZVniDwwPSko0vyXsB.tpK5t5e',51),('rutvikpatel','$2b$10$TXl3zTw1O9HZCj8s49dlHeh/mWShsJIzCtgsf7A05YyDV/zfOZKL.',58),('sarikavadodariya','$2b$10$NGQjiz9CM6DqWBEJn7/6yeNrHsBbDC7MJdb6pHUY7Qn0iFneLSadW',32),('shilpiparikh','$2b$10$B54qwHCJEJVO66JKR4tSJeI.41u.FFxRBqNgYCqLuydBD2rnMNgae',56),('shivaghiya','$2b$10$0pSZXOEOUKLS/0iytj4N0OgU6GiKntGpDNxxjZv9W.Z0nFD20w5nW',45),('sidhharthpatel','$2b$10$O04uUEwv3Zl3ISyjaGduw.bTSxJ4OEgcGsootJpihvfh5XGa4nubG',10),('suketushah','$2b$10$9FgMcpfMXMnIhMIIuY.jjefD2o79.NzFbnK6CCpQ3CNkdegN1n5ZO',43),('tishyapatel','$2b$10$diXxDzeoG3.FXH/9KWZkmuxTv0WAoOy9r7JMtJBfoUpA4D63V4r7u',59),('vidhyakothadiya','$2b$10$jwuaCa8gLkt3R6UpchAOb.HGXM3gdmvP.tVJmjtvFVo7eRfySojPW',33),('vishvanathvani','$2b$10$MKOYGydapv5soiZrRbfxf.gMQlPPclmm2wDT.kHWqm4eWwh2wocAW',29),('yashamin','$2b$10$V3ccgbkei6xZPsqKXhGJhe1f/FjIoRZZuPMVYUP7WLlzbxrMlRSd2',27),('yashmakadiya','$2b$10$bJcQh1T/63lZBuHcUWFsGOE60vxgm2nyOj5Z1KFq4mKEHyuXijys2',53),('yashpatel','$2b$10$k4nVKzxG9FlIpoYwYtGc5O8nvpYsRj33e9rRPG5SDKPFRCh.AXQYu',2),('yashviraythatha','$2b$10$dZuO4Zjo6z1sb2X47G85be1c9vUt.xvlgKLWdXIshXAPsXif8czzS',31),('zeelmehta','$2b$10$zhMiqJhAXg8saUAf6GuSLe.aIyE4zSBCwxHyFqsQdqC7btSGNF2Aq',42);
/*!40000 ALTER TABLE `student_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `std_id` int NOT NULL,
  `std_name` varchar(45) NOT NULL,
  `std_gender` varchar(5) NOT NULL,
  `std_address` varchar(200) NOT NULL,
  `std_contact` bigint NOT NULL,
  `std_birthdate` date NOT NULL DEFAULT '0000-00-00',
  `sv_id` int NOT NULL,
  `inst_id` int DEFAULT '0',
  `grade_id` int NOT NULL,
  `device_id` int DEFAULT NULL,
  PRIMARY KEY (`std_id`),
  UNIQUE KEY `std_id_UNIQUE` (`std_id`),
  KEY `svs_id_idx` (`sv_id`),
  KEY `fk_inst_id_idx` (`inst_id`),
  KEY `fk_grade_id_idx` (`grade_id`),
  KEY `fk_device_id_idx` (`device_id`),
  CONSTRAINT `fk_device_id` FOREIGN KEY (`device_id`) REFERENCES `device_info` (`device_id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_grade_id` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`grade_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_inst_id` FOREIGN KEY (`inst_id`) REFERENCES `institutes` (`inst_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_sv_id` FOREIGN KEY (`sv_id`) REFERENCES `supervisors` (`sv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Hansal Parmar','M','Rajkot',8583014553,'2021-03-02',11,1,10,7),(2,'Yash Patel','M','Anand',8866754634,'2004-07-13',11,0,3,3),(3,'Rahil Shah','M','Ahmedabad',9898564733,'2004-03-07',11,1,5,NULL),(4,'Dhara Patel','F','Anand',8866908765,'2003-04-02',3,0,4,NULL),(5,'Nishi Patel','F','Vadodara',9663548788,'2008-04-24',11,2,7,7),(6,'Hinel Mistry','F','Vyara',8460110909,'1998-08-21',11,1,1,1),(7,'Naimish Ghevariya','M','Vadodara',9180505139,'2007-12-18',4,0,5,NULL),(8,'Chirag Jethva','M','Surat',8883509101,'2007-04-11',3,0,4,NULL),(9,'Riya Intwala','F','Valsad',9872853704,'2014-10-28',2,0,5,NULL),(10,'Sidhharth Patel','M','Bhavnagar',9917152477,'2014-06-16',4,0,1,NULL),(11,'Dharam Lokhandwala','M','Rajkot',9138773625,'2000-04-01',3,0,1,NULL),(12,'Priyank Shah','M','Ahemdabad',9713011091,'2005-08-06',4,0,8,NULL),(13,'Kalpit Machhi','M','Amreli',9015812308,'2007-10-13',3,0,4,NULL),(14,'Jay Khatri','M','Vadodara',9312948093,'2001-10-24',3,0,6,NULL),(15,'Poojan Dharaiya','M','Amreli',9207345113,'2004-03-10',11,0,4,2),(16,'Manthan Shah','M','Ankleshwar',9754306254,'2008-06-19',3,2,7,NULL),(17,'Hussain Saddikot','M','Nadiad',9728468414,'2005-03-02',2,0,1,NULL),(18,'Preet Shah','M','Bharuch',9680899131,'2004-12-07',2,0,3,NULL),(19,'Abhishek Sapariya','M','Surendranagar',9119665686,'2001-05-21',4,0,10,NULL),(20,'Richa Shah','F','Surat',9198288914,'2002-11-02',2,0,2,NULL),(21,'Aashay Pandya','M','Anand',8960289257,'2007-07-08',4,0,7,NULL),(22,'Aakash Patel','M','Rajkot',9315134530,'2010-10-20',4,0,8,NULL),(23,'Aayushi Patel','F','Kheda',9913817021,'2004-02-24',2,0,10,NULL),(24,'Mihir Patel','M','Ahemdabad',9375953095,'2005-06-08',2,0,9,NULL),(25,'Megh Pandya','M','Ahemdabad',9112411047,'2006-06-04',3,0,10,NULL),(26,'Dharmik Patel','M','Junagadh',9508211225,'2000-05-12',11,0,4,8),(27,'Yash Amin','M','Junagadh',9665256024,'2000-12-24',11,0,8,NULL),(28,'Priyal Amin','F','Gandhinagar',9694072952,'2004-07-11',2,0,2,NULL),(29,'Vishva Nathvani','F','Ankleshwar',9047116725,'2009-01-07',11,0,3,NULL),(30,'Nandini Chovatiya','F','Vadodara',9514994379,'2006-11-17',4,0,2,NULL),(31,'Yashvi raythatha','F','Rajkot',9529521014,'2001-11-25',4,0,8,NULL),(32,'Sarika Vadodariya','F','Amreli',9024046463,'2007-03-04',4,0,3,NULL),(33,'Vidhya Kothadiya','F','Surendranagar',8957035023,'2008-09-22',2,0,10,NULL),(34,'Namrata Patel','F','Amreli',8869738992,'2004-04-06',3,0,9,NULL),(35,'Anushka Sandesara','F','Surendranagar',9118599440,'2000-05-24',4,0,4,NULL),(36,'Dhruvi Shah','F','Surendranagar',9089143581,'2003-07-03',3,0,5,NULL),(37,'Akshat Shah','M','Kheda',9477987689,'2006-12-07',4,0,3,NULL),(38,'Darshi Shah','F','Bharuch',9612662891,'2001-05-26',2,0,1,NULL),(39,'Love Patel','M','Surendranagar',8906848397,'2011-05-27',4,0,10,NULL),(40,'Nimesh Italiya','M','Valsad',9105559077,'2003-01-08',4,0,9,NULL),(41,'Nisarg Patel','M','Nadiad',9424570668,'2007-08-05',2,0,2,NULL),(42,'Zeel Mehta ','F','Navsari',9247084097,'2002-10-12',3,0,3,NULL),(43,'Suketu Shah','M','Valsad',9982347392,'2005-10-12',4,0,6,NULL),(44,'Ridhhi Patel','F','Surendranagar',9935087556,'2007-06-18',2,0,6,NULL),(45,'Shiva Ghiya','M','Gandhinagar',9635518993,'2010-05-16',4,0,3,NULL),(46,'Kathan Shah','M','Bhavnagar',9559791821,'2014-02-11',3,0,10,NULL),(47,'Keyur Talati','M','Surendranagar',8928982530,'2011-03-08',3,0,1,NULL),(48,'Meet Suthar','M','Amreli',8912605964,'2014-11-29',4,0,3,NULL),(49,'Garvit Gupta','M','Rajkot',9078872310,'2008-09-21',3,0,7,NULL),(50,'Jay Desai','M','Gandhinagar',9324340437,'2000-07-10',11,0,7,NULL),(51,'Rohan Jethloja','M','Junagadh',9532982983,'2007-12-13',11,0,5,NULL),(52,'Milind Shah','M','Ahemdabad',9777525384,'2013-05-21',4,0,10,NULL),(53,'Yash Makadiya','M','Bhavnagar',9187692462,'2010-05-01',2,0,9,NULL),(54,'Karan Patel','M','Surat',9820810066,'2013-06-02',11,0,5,NULL),(55,'Kapil Bhatt','M','Ahemdabad',9187730616,'2010-06-07',2,0,6,NULL),(56,'Shilpi Parikh','F','Anand',9099617957,'2008-02-18',4,0,8,NULL),(57,'Dev Changela','M','Surat',9595973873,'2005-06-11',4,0,8,NULL),(58,'Rutvik Patel','M','Kheda',9761155465,'2013-11-05',2,0,10,NULL),(59,'Tishya Patel','M','Valsad',8878503153,'2004-07-24',11,0,9,NULL),(60,'Neha Sajnani','F','Ahemdabad',9663354321,'2009-04-14',2,0,7,NULL),(62,'Jainil Gupta','M','Anand',9666634771,'2021-03-02',11,1,4,NULL),(64,'Rahul Patel','M','Surat',7896541325,'2021-04-26',11,1,1,NULL),(65,'Nishi Parmar','F','Valsad',7896541236,'2018-05-16',3,2,9,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisor_inbox`
--

DROP TABLE IF EXISTS `supervisor_inbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_inbox` (
  `message_id` int NOT NULL,
  `message` varchar(400) NOT NULL,
  `std_id` int NOT NULL,
  `sv_id` int NOT NULL,
  PRIMARY KEY (`message_id`),
  UNIQUE KEY `msg_id_UNIQUE` (`message_id`),
  KEY `std_if_fk_idx` (`std_id`),
  KEY `sv_id_fk_idx` (`sv_id`),
  CONSTRAINT `std_if_fk` FOREIGN KEY (`std_id`) REFERENCES `students` (`std_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `sv_id_fk` FOREIGN KEY (`sv_id`) REFERENCES `supervisors` (`sv_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_inbox`
--

LOCK TABLES `supervisor_inbox` WRITE;
/*!40000 ALTER TABLE `supervisor_inbox` DISABLE KEYS */;
INSERT INTO `supervisor_inbox` VALUES (2,'Hello Sir, I wanted access of 7th standard books',2,11);
/*!40000 ALTER TABLE `supervisor_inbox` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisor_login`
--

DROP TABLE IF EXISTS `supervisor_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_login` (
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `sv_id` int NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `sv_id_idx` (`sv_id`),
  CONSTRAINT `sv_id` FOREIGN KEY (`sv_id`) REFERENCES `supervisors` (`sv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_login`
--

LOCK TABLES `supervisor_login` WRITE;
/*!40000 ALTER TABLE `supervisor_login` DISABLE KEYS */;
INSERT INTO `supervisor_login` VALUES ('aashish12','$2b$10$i9lWWi0N4Xt/crf7byAhlOkz/gQGT879R19SK7P63jd0jCby82AZm',1),('aditya','$2b$05$jQRdvgdSZKWDUYDpSU30uuKSjPDd6n28NUQ1.GQFC0k87poOC3jWK',10),('dev33','$2b$05$27GAx2gT6668BqeZs28Om.QYQsfsru0I3kBffRajWZVAjBtxZP7Su',5),('hinel218','$2b$05$OZaPEHQdWesK9ik335qWYeNEjI4AVDefYjTKArgN5xAH2egKakRPm',11),('krupa12','$2b$10$zc4KRuNIhqNG.GO3hSY1Luy9hWIy7JDfEDcuVt7Q1RgC0vlwoNeoO',3),('Padmavathi','$2b$05$3DgkVkcCefTliDXI4lvOsemCh7FNzvq3WuQuHMFSBxb/G5pwzt.xe',7),('svir99','$2b$10$QMhy0kEFILVvCRFA3/l89ebrEPa9Y8MjmbWe6lYU4EWSW6fPHBNnm',2),('yashah89','$2b$10$aRnjhCcBW8udgqAikckTjuUE3fkyjhet6mXVzC08ZYwcTGPgbxgFW',4);
/*!40000 ALTER TABLE `supervisor_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisors`
--

DROP TABLE IF EXISTS `supervisors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisors` (
  `sv_id` int NOT NULL,
  `sv_name` varchar(30) NOT NULL,
  `sv_contact` bigint NOT NULL,
  `sv_status` int NOT NULL DEFAULT '0',
  `no_students` int NOT NULL DEFAULT '0',
  `sv_email` varchar(50) NOT NULL,
  `sv_location` varchar(30) NOT NULL,
  PRIMARY KEY (`sv_id`),
  UNIQUE KEY `sv_id_UNIQUE` (`sv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisors`
--

LOCK TABLES `supervisors` WRITE;
/*!40000 ALTER TABLE `supervisors` DISABLE KEYS */;
INSERT INTO `supervisors` VALUES (1,'Aashish Patel',9866433210,1,0,'aashishpatel@gmail.com','Anand'),(2,'Santosh Viradiya',8866186420,1,15,'santoshviradiya@gmail.com','Ahmedabad'),(3,'Krupali Dave',8866749210,1,14,'krupalidave@gmail.com','Vadodara'),(4,'Yash Shah',9898450420,1,19,'yashshah@gmail.com','Surat'),(5,'Devarsh Shah',9277746599,0,0,'devarshshah@gmail.com','Rajkot'),(7,'Padmavathi Bindulal ',4597136835,0,0,'padmavathibindulal.ce@charuat.ac.in','Anand'),(10,'Aditya Mistry',9106543692,0,0,'adityamistry@gmail.com','Vapi'),(11,'hinel mistry',8460110909,1,15,'mistryhinel8173@gmail.com','Vyara');
/*!40000 ALTER TABLE `supervisors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-15 23:21:52
