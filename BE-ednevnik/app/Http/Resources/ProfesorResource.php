<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfesorResource extends JsonResource
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
            'ime' => $this->ime,
            'titula' => $this->titula,
            'kabinet' => $this->kabinet,
            'konsultacije' => $this->konsultacije,
            'predmeti' => PredmetResource::collection($this->whenLoaded('predmeti')), // Samo kada su predmeti učitani
        ];
    }
}
