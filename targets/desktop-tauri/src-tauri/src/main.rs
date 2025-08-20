// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

// Tauri command to ensure the FastAPI core is running
#[tauri::command]
fn ensure_core() -> Result<String, String> {
    // Check if core is already running
    let output = Command::new("curl")
        .args(&["-s", "http://localhost:8000/"])
        .output();
        
    match output {
        Ok(result) => {
            if result.status.success() {
                return Ok("Core already running".to_string());
            }
        }
        Err(_) => {
            // curl might not be available, try to start core anyway
        }
    }
    
    // Try to start the FastAPI core
    // This is a simplified approach - in production you'd want better process management
    let core_path = std::env::current_dir()
        .map_err(|e| format!("Failed to get current directory: {}", e))?
        .join("../../../template");
    
    let _child = Command::new("python")
        .args(&["-m", "uvicorn", "template.core.main:app", "--host", "127.0.0.1", "--port", "8000"])
        .current_dir(&core_path)
        .spawn()
        .map_err(|e| format!("Failed to start core: {}. Please ensure Python and dependencies are installed.", e))?;
        
    Ok("Attempted to start core".to_string())
}

#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "Smartbot Desktop",
        "version": "0.1.0",
        "description": "Local-first SMART Recovery companion",
        "local_first": true,
        "privacy": "All data stays on your device"
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ensure_core, get_app_info])
        .setup(|app| {
            // Try to ensure core is running on app startup
            let _ = ensure_core();
            
            // Set app menu (optional)
            #[cfg(target_os = "macos")]
            {
                use tauri::{Menu, Submenu, MenuItem};
                
                let menu = Menu::new()
                    .add_submenu(Submenu::new(
                        "Smartbot",
                        Menu::new()
                            .add_native_item(MenuItem::About("Smartbot Desktop".to_string()))
                            .add_native_item(MenuItem::Separator)
                            .add_native_item(MenuItem::Services)
                            .add_native_item(MenuItem::Separator)
                            .add_native_item(MenuItem::Hide)
                            .add_native_item(MenuItem::HideOthers)
                            .add_native_item(MenuItem::ShowAll)
                            .add_native_item(MenuItem::Separator)
                            .add_native_item(MenuItem::Quit),
                    ))
                    .add_submenu(Submenu::new(
                        "Edit",
                        Menu::new()
                            .add_native_item(MenuItem::Undo)
                            .add_native_item(MenuItem::Redo)
                            .add_native_item(MenuItem::Separator)
                            .add_native_item(MenuItem::Cut)
                            .add_native_item(MenuItem::Copy)
                            .add_native_item(MenuItem::Paste)
                            .add_native_item(MenuItem::SelectAll),
                    ))
                    .add_submenu(Submenu::new(
                        "Window",
                        Menu::new()
                            .add_native_item(MenuItem::Minimize)
                            .add_native_item(MenuItem::Zoom),
                    ));
                    
                app.set_menu(menu)?;
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}