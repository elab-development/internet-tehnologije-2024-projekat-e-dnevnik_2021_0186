<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoditeljResource;
use App\Models\Roditelj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoditeljController extends Controller
{
    //prikaz svih roditelja sa paginacijom
    public function index()
    {
        $roditelji = Roditelj::paginate(10); 
        return RoditeljResource::collection($roditelji);
    }

    //prikaz odredjenog roditelja
    public function show($id)
    {
        $user = Auth::user();

        if ($user->tip_korisnika !== 'roditelj') {
            return response()->json(['error' => 'Nemate dozvolu za pristup ovom resursu.'], 403);
        }

        $roditelj = Roditelj::with('ucenici')->find($id);

        if (!$roditelj) {
            return response()->json(['error' => 'Roditelj nije pronađen.'], 404);
        }

        return new RoditeljResource($roditelj);
    }


    //kreiranje novog roditelja
        public function store(Request $request)
        {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'ime' => 'required|string',
                'kontakt' => 'required|string',
            ]);
    
            $roditelj = Roditelj::create([
                'user_id' => $request->user_id,
                'ime' => $request->ime,
                'kontakt' => $request->kontakt,
            ]);
    
            return response()->json([
                'message' => 'Roditelj uspesno kreiran.',
                'roditelj' => new RoditeljResource($roditelj),
            ], 200);
        }

        //azuriranje podataka na profilu roditelja - samo svoj profil moze da azurira
        public function update(Request $request, $id)
        {
            $user = Auth::user();

            // Provera da li je ulogovani korisnik roditelj
            if ($user->tip_korisnika !== 'roditelj') {
                return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
            }

            // Pronalazak roditelja po ID-ju iz URL-a
            $roditelj = Roditelj::find($id);

            // Provera da li roditelj postoji
            if (!$roditelj) {
                return response()->json(['error' => 'roditelj nije pronađen.'], 404);
            }

            // Provera da li roditelj ažurira SAMO SVOJ nalog
            if ($roditelj->user_id !== $user->id) {
                return response()->json(['error' => 'Ne možete menjati podatke drugog roditelja.'], 403);
            }

            // Validacija podataka
            $validated = $request->validate([
                'ime' => 'required|string',
                'kontakt' => 'required|string'
            ]);

            // Ažuriranje podataka roditelja
            $roditelj->update($validated);

            return response()->json([
                'message' => 'Podaci uspešno ažurirani.',
                'roditelj' => new RoditeljResource($roditelj),
            ], 200);
        }

        
    
    
}
