{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Backend Server",
            "type": "shell",
            "command": "cd backend; php artisan serve",
            "isBackground": true,
            "problemMatcher": {
                "owner": "custom",
                "pattern": {
                    "regexp": "^$"
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": "^Starting Laravel development server",
                    "endsPattern": "^Server running on"
                }
            }
        },
        {
            "label": "Start Frontend Server",
            "type": "shell",
            "command": "cd frontend; npm run dev",
            "isBackground": true,
            "problemMatcher": {
                "owner": "custom",
                "pattern": {
                    "regexp": "^$"
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": "^VITE v",
                    "endsPattern": "^Local:"
                }
            }
        },
        {
            "label": "Start BetterVersion",
            "dependsOn": ["Start Backend Server", "Start Frontend Server"],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
} 