#  E - DNEVNIK VEB APLIKACIJA

 Projekat se sastoji od **Laravel REST API** koji predstavlja backend i **React SPA** koji predstavlja frontend, sa konzistentnim dizajnom i cak cetiri korisnicke uloge - roditelj, profesor, ucenik i administrator

---

## Glavne funkcionalnosti aplikacije

- **Pregled predmeta i ocena (učenik):** uvid u sve predmete, ocene, proseke i istoriju polaganja ispita.
- **Unos i izmena ocena (profesor):** dodavanje ocena, izostanaka i komentara za učenike po predmetima.
- **Prijava ispita (učenik):** mogućnost prijave za ispitne rokove sa automatskim praćenjem broja prijava.
- **Evidencija ispita (službenik):** unos rezultata ispita, ažuriranje statusa i administracija roka.
- **Metrike (admin):** kartice sa ukupnim brojem učenika, profesora, predmeta i prijava ispita + **jedan Recharts dijagram** (npr. Broj ocena po statusu).
- **Izvoz podataka u PDF/Excel:** generisanje izveštaja o ocenama i prijavama.

---

## Uloge korisnika

- **Neulogovani korisnik** – vidi javne stranice (o školi, login/registracija).  
- **Učenik** – pregled predmeta i ocena, prijava ispita, uvid u statistiku i generisanje PDF izveštaja.  
- **Profesor** – unos i izmena ocena, pregled učenika po predmetu, evidencija izostanaka.  
- **Službenik** – upravlja predmetima, unosi ocene i prijave, vodi administraciju ispita.  
- **Administrator** – ima uvid u sve podatke, metrike.

---

## Arhitektura aplikacije

- **Backend:** Laravel, Eloquent ORM, validacije, resursi (`JsonResource`), Sanctum autentifikacija
- **Frontend:** React (SPA) + React Charts, React Axios
- **Baza:** MySQL sa migracijama, fabrikama i seeder-ima, kao GUI koriscen PHPMyAdmin
- **Testiranje:** Rucno testiranje ruta kroz Postman

---
##  Model podataka (osnovni)

- **Korisnici (`users`):** ime, email, lozinka, tip_korisnika (`ucenik`, `profesor`, `sluzbenik`, `admin`).  
- **Predmeti (`predmeti`):** naziv, profesor_id.  
- **Prijave ispita (`prijave_ispita`):** student_id, predmet_id, broj roka, broj prijave, status, ocena.  
- **Ocene (`ocene`):** vrednost ocene, komentar, datum, profesor_id, student_id, predmet_id.  

---

## Koriscene Tehnologije

**Backend**
- Laravel 10, Sanctum (API tokeni)
- Eloquent ORM veze
- Barry PDF za kreiranje PDF izvestaja
- PHP 8.2+

**Frontend**
- React 18, React Router
- React charts
- React icons
- Axios

---

##  Ključni API endpoint-i (skraćeno)

> Sve rute su pod `/api`. Deo njih je javan, dok su ostale zaštićene preko **Sanctum** middleware-a.

### Javne rute
- **Autentikacija:**
  - `POST /register` – registracija korisnika
  - `POST /login` – prijava korisnika

- **Kreiranje profila po tipu:**
  - `POST /roditelj` – kreiranje roditelja
  - `POST /ucenik` – kreiranje učenika
  - `POST /profesor` – kreiranje profesora

- **Pregled svih modela:**
  - `GET /profesori` – svi profesori
  - `GET /ucenici` – svi učenici
  - `GET /roditelji` – svi roditelji
  - `GET /ocene` – sve ocene
  - `GET /predmeti` – svi predmeti

---

### Zaštićene rute (auth:sanctum)

- **Autentikacija:**
  - `POST /logout` – odjava

- **Roditelj:**
  - `GET /roditelji/{id}` – prikaz profila
  - `PUT /roditelji/{id}` – ažuriranje profila
  - `GET /ocene/moje-dece` – ocene učenika vezanih za roditelja

- **Učenik:**
  - `GET /ucenici/{id}` – prikaz profila
  - `PUT /ucenici/{id}` – ažuriranje profila
  - `GET /ocene/moje` – pregled svojih ocena

- **Profesor:**
  - `GET /profesori/{id}` – prikaz profila
  - `PUT /profesori/{id}` – ažuriranje profila
  - `POST /profesori/dodaj-predmet` – dodeljivanje predmeta profesoru
  - `DELETE /profesori/ukloni-predmet/{predmet_id}` – uklanjanje predmeta profesoru
  - `GET /profesor/dashboard` – pregled dashboarda (predmeti + učenici + ocene)
  - `GET /profesor/export-pdf` – izvoz dashboarda u PDF
  - `PATCH /profesor/oceni` – unos/izmena ocene

- **Predmeti:**
  - `GET /predmeti/dostupni` – pregled dostupnih predmeta
  - `POST /predmeti` – kreiranje predmeta (admin)
  - `PUT /predmeti/{id}` – izmena predmeta (admin)
  - `DELETE /predmeti/{id}` – brisanje predmeta (admin)
  - `PATCH /predmeti/{id}/ukloni-profesora` – uklanjanje profesora sa predmeta (admin)

- **Administrator:**
  - `GET /metrics` – prikaz metrika za admin panel (broj učenika, profesora, ocena, predmeta)

---

## Javni veb servisi

Aplikacija koristi i eksterne API-je za dodatne funkcionalnosti:

- **Pexels API** – za preuzimanje slika (npr. ilustrovani prikaz predmeta ili profila).
  - Endpoint primer:  
    `GET https://api.pexels.com/v1/search?query={pojam}`  
  - Zaglavlje:  
    `Authorization: Bearer {API_KEY}`

- **Numbers API** – za prikaz zanimljivih činjenica o brojevima (npr. broj prijava, broj učenika, broj predmeta).
  - Endpoint primeri:  
    - `GET http://numbersapi.com/{number}` – random činjenica o broju  
    - `GET http://numbersapi.com/{number}/math` – matematička činjenica  
    - `GET http://numbersapi.com/{number}/year` – istorijska činjenica  

Integracija sa ovim servisima omogućava da aplikacija bude **dinamičnija i interaktivnija**, dajući vizuelni i edukativni sadržaj uz osnovne funkcionalnosti e-dnevnika.

## Pokretanje projekta lokalno

1. Prvi korak je kloniranje repozitorijuma:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-e-dnevnik_2021_0186
```
2. Pokrenite backend:
```bash
   cd BE-ednevnik
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd fe-ednevnik
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Laravel pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
