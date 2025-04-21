<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PredmetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'tezina' => $this->tezina,
            'profesor' => $this->profesor ? [
                'id' => $this->profesor->id,
                'ime' => $this->profesor->ime,
                'kabinet'=> $this->profesor->kabinet,
                'konsultacije'=> $this->profesor->konsultacije,
            ] : null

        ];
    }
}
