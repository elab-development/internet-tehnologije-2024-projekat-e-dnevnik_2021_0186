<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Predmet extends Model
{
    use HasFactory;

    protected $table = 'predmeti';

    protected $fillable = [
        'naziv', // naziv predmeta
        'opis', // opis predmeta 
        'tezina', // tezina predmeta
        'profesor_id', // profesor koji predaje predmet
    ];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class);
    }

    public function ocene()
    {
        return $this->hasMany(Ocena::class);
    }
}
