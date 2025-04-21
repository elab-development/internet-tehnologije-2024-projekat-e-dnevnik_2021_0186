<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'tip_korisnika' //admin, profesor, ucenik, roditelj
    ];

    public function ucenik()
    {
        return $this->hasOne(Ucenik::class);
    }

    public function profesor()
    {
        return $this->hasOne(Profesor::class);
    }

    public function roditelj()
    {
        return $this->hasOne(Roditelj::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

 
}
