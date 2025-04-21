<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ocena extends Model
{
    use HasFactory;

    protected $table = 'ocene';

    protected $fillable = [
        'ucenik_id',
        'predmet_id',
        'ocena', // numerička ocena (1-5)
        'datum', // datum dodeljivanja ocene
        'komentar', // dodatni komentar uz ocenu (opciono)
    ];

    public function ucenik()
    {
        return $this->belongsTo(Ucenik::class);
    }

    public function predmet()
    {
        return $this->belongsTo(Predmet::class);
    }
}
