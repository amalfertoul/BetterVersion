<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
    public function map()
{
    $this->mapApiRoutes();  // Cette ligne est importante pour charger les routes de 'api.php'

    // Autres méthodes de mappage des routes...
}

}
