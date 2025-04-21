<?php

namespace App\Http\Controllers;

use App\Http\Resources\UcenikResource;
use App\Models\Ocena;
use App\Models\Predmet;
use App\Models\Ucenik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UcenikController extends Controller
{
    //ispis svih ucenika
    public function index()
    {
        $ucenici = Ucenik::paginate(10); // Paginacija po 10 zapisa
        return UcenikResource::collection($ucenici);
    }

    //ispis jednog ucenika
    public function show($id)
    {
        $user = Auth::user();

        if ($user->tip_korisnika !== 'ucenik') {
            return response()->json(['error' => 'Nemate dozvolu za pristup ovom resursu.'], 403);
        }
    
        $ucenik = Ucenik::with('roditelj')->where('id', $id)->first(); 
        
    
        if (!$ucenik) {
            return response()->json(['error' => 'Učenik nije pronađen.'], 404);
        }

        return new UcenikResource($ucenik);
    }

    //funkcija koja dodeljuje uceniku prazne ocene - da bi posle mogao da dobije pravu ocenu
    public function dodeliPrazneOceneZaSvePredmete($ucenikId)
    {
        $predmeti = Predmet::all();

        foreach ($predmeti as $predmet) {
            Ocena::create([
                'ucenik_id' => $ucenikId,
                'predmet_id' => $predmet->id,
                'ocena' => null,
                'datum' => null,
                'komentar' => 'Nije ocenjeno',
            ]);
        }
    }

   //kreiranje ucenika pri cemu kad se tek pravi, dobija prazne veze sa ocenama
        public function store(Request $request)
        {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'ime' => 'required|string|max:255',
                'razred' => 'required|integer|min:1|max:8',
                'odeljenje' => 'required|integer',
                'roditelj_id' => 'nullable|exists:roditelji,id',
            ]);
    
            $ucenik = Ucenik::create([
                'user_id' => $request->user_id,
                'ime' => $request->ime,
                'razred' => $request->razred,
                'odeljenje' => $request->odeljenje,
                'roditelj_id' => $request->roditelj_id,
            ]);

            //da kada se ucenik registruje, da dobije sve predmete dodeljene u app
            $this->dodeliPrazneOceneZaSvePredmete($ucenik->id);

            return response()->json([
                'message' => 'Ucenik uspesno kreiran.',
                'ucenik' => new UcenikResource($ucenik),
            ], 201);
    
           
        }

        //azuriranje profila ucenika
        public function update(Request $request, $id)
        {
            $user = Auth::user();

            // Provera da li je ulogovani korisnik učenik
            if ($user->tip_korisnika !== 'ucenik') {
                return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
            }

            // Pronalazak učenika po ID-ju iz URL-a
            $ucenik = Ucenik::find($id);

            // Provera da li učenik postoji
            if (!$ucenik) {
                return response()->json(['error' => 'Učenik nije pronađen.'], 404);
            }

            // Provera da li učenik ažurira SAMO SVOJ nalog
            if ($ucenik->user_id !== $user->id) {
                return response()->json(['error' => 'Ne možete menjati podatke drugog učenika.'], 403);
            }

            // Validacija podataka
            $validated = $request->validate([
                'razred' => 'integer|min:1|max:8',
                'odeljenje' => 'required|integer',
                'roditelj_id' => 'exists:roditelji,id', 
            ]);

            // Ažuriranje podataka učenika
            $ucenik->update($validated);

            return response()->json([
                'message' => 'Podaci uspešno ažurirani.',
                'ucenik' => new UcenikResource($ucenik),
            ], 200);
        }

}
