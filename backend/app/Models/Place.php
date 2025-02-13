<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $table="places";

    protected $fillable= [
        'title',
        'description',
        'image',
        'latitude',
        'longitude',
    ];
}
