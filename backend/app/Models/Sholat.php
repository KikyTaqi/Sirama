<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sholat extends Model
{
    protected $table="sholat";

    protected $fillable= [
        'title',
        'description',
        'image',
        'latitude',
        'longitude',
    ];
}
