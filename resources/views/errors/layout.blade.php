<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', 'Error')</title>
        
        <style>
            /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
            html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}a{background-color:transparent}code{font-family:monospace,monospace;font-size:1em}[hidden]{display:none}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}a{color:inherit;text-decoration:inherit}code{font-family:Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}svg,video{display:block;vertical-align:middle}video{max-width:100%;height:auto}

            /* Custom Error Page Styles */
            body {
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }

            /* Animated background particles */
            body::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
                animation: float 20s ease-in-out infinite;
                pointer-events: none;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }

            .error-container {
                text-align: center;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 3rem 2rem;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                max-width: 500px;
                width: 90%;
                position: relative;
                z-index: 10;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .error-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                color: white;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .error-code {
                font-size: 4rem;
                font-weight: 700;
                color: #2d3748;
                margin: 0;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: glow 3s ease-in-out infinite alternate;
            }

            @keyframes glow {
                from { filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.5)); }
                to { filter: drop-shadow(0 0 20px rgba(118, 75, 162, 0.8)); }
            }

            .error-message {
                font-size: 1.5rem;
                color: #4a5568;
                margin: 1rem 0 2rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .error-description {
                font-size: 1rem;
                color: #718096;
                margin-bottom: 2rem;
                line-height: 1.6;
            }

            .back-button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-size: 0.9rem;
            }

            .back-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #5a67d8, #6b46c1);
            }

            /* Responsive Design */
            @media (max-width: 640px) {
                .error-container {
                    padding: 2rem 1.5rem;
                    margin: 1rem;
                }
                
                .error-code {
                    font-size: 3rem;
                }
                
                .error-message {
                    font-size: 1.2rem;
                }
                
                .error-icon {
                    width: 60px;
                    height: 60px;
                    font-size: 2rem;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                body {
                    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
                }
                
                .error-container {
                    background: rgba(45, 55, 72, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .error-code {
                    color: #e2e8f0;
                }
                
                .error-message {
                    color: #cbd5e0;
                }
                
                .error-description {
                    color: #a0aec0;
                }
            }

            /* Loading animation for dynamic content */
            .fade-in {
                animation: fadeIn 0.8s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="error-container fade-in">
            <div class="error-icon">
                ⚠️
            </div>
            
            <h1 class="error-code">
                @yield('code', '404')
            </h1>
            
            <h2 class="error-message">
                @yield('message', 'Page Not Found')
            </h2>
            
            <p class="error-description">
                @yield('description', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')
            </p>
            
            <a href="{{ url('/') }}" class="back-button">
                ← Back to Home
            </a>
        </div>
    </body>
</html>