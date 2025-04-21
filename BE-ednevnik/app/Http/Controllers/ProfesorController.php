<?php

namespace App\Http\Controllers;

use App\Http\Resources\PredmetResource;
use App\Http\Resources\ProfesorResource;
use App\Models\Predmet;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfesorController extends Controller
{
    public function index()
    {
        $profesori = Profesor::paginate(10); // Paginacija po 10 zapisa
        return ProfesorResource::collection($profesori);
    }

    public function show($id)
    {
        $user = Auth::user();

        if ($user->tip_korisnika !== 'profesor') {
            return response()->json(['error' => 'Nemate dozvolu za pristup ovom resursu.'], 403);
        }

        // Učitavanje profesora zajedno sa predmetima
        $profesor = Profesor::with('predmeti')->find($id);

        if (!$profesor) {
            return response()->json(['error' => 'Profesor nije pronađen.'], 404);
        }

        return new ProfesorResource($profesor);
    }

    //kreiranje novog profila profesora prilikom registracije
    public function store(Request $request)
    {
        // Validacija podataka
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'ime' => 'required|string',
            'titula' => 'required|string',
            'kabinet' => 'required|string',
            'konsultacije' => 'required|string',
        ]);

        // Kreiranje profesora
        $profesor = Profesor::create([
            'user_id' => $request->user_id,
            'ime' => $request->ime,
            'titula' => $request->titula,
            'kabinet' => $request->kabinet,
            'konsultacije' => $request->konsultacije,
        ]);

        return response()->json([
            'message' => 'Profesor uspesno kreiran.',
            'profesor' => new ProfesorResource($profesor),
        ], 200);
    }

    //azuriranje profila profesora
    public function update(Request $request, $id)
        {
            $user = Auth::user();

            // Provera da li je ulogovani korisnik profesor
            if ($user->tip_korisnika !== 'profesor') {
                return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
            }

            // Pronalazak profesora po ID-ju iz URL-a
            $profesor = Profesor::find($id);

            // Provera da li profesor postoji
            if (!$profesor) {
                return response()->json(['error' => 'profesor nije pronađen.'], 404);
            }

            // Provera da li profesor ažurira SAMO SVOJ nalog
            if ($profesor->user_id !== $user->id) {
                return response()->json(['error' => 'Ne možete menjati podatke drugog profesora.'], 403);
            }

            // Validacija podataka
            $validated = $request->validate([
                'titula' => 'required|string',
                'kabinet' => 'required|string',
                'konsultacije' => 'required|string',
            ]);

            // Ažuriranje podataka profesora
            $profesor->update($validated);

            return response()->json([
                'message' => 'Podaci uspešno ažurirani.',
                'profesor' => new ProfesorResource($profesor),
            ], 200);
        }

        //odabir predmeta koji ce da predaje - moze samo predmete koje vec ne predaje neki drugi profesor
    public function dodajPredmet(Request $request)
        {
            $user = Auth::user();

            // Provera da li je korisnik profesor
            if ($user->tip_korisnika !== 'profesor') {
                return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
            }
        
            // Pronalazimo profesora na osnovu `user_id`
            $profesor = Profesor::where('user_id', $user->id)->first();
        
            if (!$profesor) {
                return response()->json(['error' => 'Profesor nije pronađen.'], 404);
            }
        
            // Validacija da predmet postoji
            $validated = $request->validate([
                'predmet_id' => 'required|exists:predmeti,id'
            ]);
        
            $predmet = Predmet::findOrFail($validated['predmet_id']);
        
            // Proveravamo da li predmet već ima profesora
            if ($predmet->profesor_id) {
                return response()->json(['error' => 'Ovaj predmet već ima profesora.'], 400);
            }
        
             // Proveravamo da li profesor_id nije null pre dodeljivanja -ne sme biti null
            if (!$profesor->id) {
                return response()->json(['error' => 'Greška: profesor ID je nepoznat.'], 500);
            }

            // Ažuriramo predmet sa profesorom
            $predmet->profesor_id = $profesor->id;
            $predmet->save();
        
            return response()->json([
                'message' => 'Predmet uspešno dodeljen profesoru.',
                'predmet' => new PredmetResource($predmet),
            ], 200);
        }

        //odustajanje od predavanja predmeta
        public function ukloniPredmet($predmet_id)
        {
            $user = Auth::user();
        
            // Proveravamo da li je korisnik profesor
            if ($user->tip_korisnika !== 'profesor') {
                return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
            }
        
            // Pronalazimo profesora na osnovu user_id
            $profesor = Profesor::where('user_id', $user->id)->first();
        
            if (!$profesor) {
                return response()->json(['error' => 'Profesor nije pronađen.'], 404);
            }
        
            // Pronalazimo predmet
            $predmet = Predmet::find($predmet_id);
        
            if (!$predmet) {
                return response()->json(['error' => 'Predmet nije pronađen.'], 404);
            }
        
            // Proveravamo da li ovaj profesor predaje taj predmet
            if ($predmet->profesor_id !== $profesor->id) {
                return response()->json(['error' => 'Ne možete ukloniti predmet koji ne predajete.'], 403);
            }
        
            // Postavljamo profesor_id na NULL
            $predmet->profesor_id = null;
            $predmet->save();
        
            return response()->json([
                'message' => 'Predmet je uspešno uklonjen iz vašeg naloga.',
                'predmet' => new PredmetResource($predmet),
            ], 200);
        }

    }