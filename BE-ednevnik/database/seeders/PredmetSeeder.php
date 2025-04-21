<?php

namespace Database\Seeders;

use App\Models\Predmet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PredmetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $predmeti = [
            ['naziv' => 'Matematika', 'opis' => 'Osnovna matematika', 'tezina' => 3, 'profesor_id' => 2],
            ['naziv' => 'Napredna Matematika', 'opis' => 'Napredna matematika za nadarene ucenike', 'tezina' => 5, 'profesor_id' => 2],
            ['naziv' => 'Fizika', 'opis' => 'Osnovni zakoni fizike', 'tezina' => 4, 'profesor_id' => 3],
            ['naziv' => 'Hemija', 'opis' => 'Osnovni principi hemije', 'tezina' => 3, 'profesor_id' => 3],
            ['naziv' => 'Biologija', 'opis' => 'Život i organizmi', 'tezina' => 3, 'profesor_id' => 4],
            ['naziv' => 'Istorija', 'opis' => 'Istorija sveta', 'tezina' => 2, 'profesor_id' => 5],
            ['naziv' => 'Geografija', 'opis' => 'Geografija planete', 'tezina' => 2, 'profesor_id' => 5],
            ['naziv' => 'Informatika', 'opis' => 'Programiranje i IT', 'tezina' => 4, 'profesor_id' => null],
            ['naziv' => 'Engleski jezik', 'opis' => 'Osnovni kurs engleskog', 'tezina' => 2, 'profesor_id' => null],
            ['naziv' => 'Francuski jezik', 'opis' => 'Osnovni kurs francuskog', 'tezina' => 2, 'profesor_id' => null],
            ['naziv' => 'Nemacki jezik', 'opis' => 'Osnovni kurs nemackog', 'tezina' => 2, 'profesor_id' => null],
            ['naziv' => 'Likovna kultura', 'opis' => 'Umetničko izražavanje', 'tezina' => 1, 'profesor_id' => null],
            ['naziv' => 'Fizičko vaspitanje', 'opis' => 'Sport i rekreacija', 'tezina' => 1, 'profesor_id' => null],
            ['naziv' => 'Plivanje', 'opis' => 'Tehnike plivanja u unutrasnjem bazenu', 'tezina' => 2, 'profesor_id' => null],
            ['naziv' => 'Gimnastika', 'opis' => 'Osnove gimnastike i ritmickog plesa', 'tezina' => 2, 'profesor_id' => null],
        ];

        foreach ($predmeti as $predmet) {
            Predmet::create($predmet);
        }
    }
}
