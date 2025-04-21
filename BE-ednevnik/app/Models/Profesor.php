<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    use HasFactory;

    protected $table = 'profesori';

    protected $fillable = [
        'user_id',
        'ime',
        'titula',
        'kabinet',
        'konsultacije',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function predmeti()
    {
        return $this->hasMany(Predmet::class);
    }
}
