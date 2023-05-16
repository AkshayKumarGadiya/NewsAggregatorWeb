<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
class Preference extends Model implements JWTSubject
{
    use HasFactory;

    protected $fillable = [
        'id',
        'authors',
        'sources',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
