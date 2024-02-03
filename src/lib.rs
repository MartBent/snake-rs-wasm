mod utils;

use snake_rs::{Cell, Direction, SnakeGame, SnakeProvider};
use wasm_bindgen::prelude::wasm_bindgen;
use rand::Rng;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

pub struct SnakeBridge;

impl SnakeProvider for SnakeBridge {
    fn provide_random_number(&self, size: u32) -> u32 {
        let mut rng = rand::thread_rng();
        rng.gen_range(0 .. size)
    }

    fn debug_log(&self, message: &str) {
        log(message)
    }
}

#[wasm_bindgen]
pub struct Game {
    snake_game: SnakeGame
}

#[wasm_bindgen]
impl Game {
    pub fn size(&self) -> u32 {
        self.snake_game.size()
    }
    pub fn new(size: u32) -> Game {

        utils::set_panic_hook();
        let snake_game = SnakeGame::new(size, Box::new(SnakeBridge));
        
        Game {
            snake_game
        }
    }

    pub fn set_direction(&mut self, direction: u8) {
        self.snake_game.set_direction(Direction::from(direction));
    }

    pub fn tick(&mut self) {
        self.snake_game.tick();
    }

    pub fn render(&self) -> *const Cell {
        self.snake_game.cells().as_ptr()
    }

    pub fn get_pixel_buffer_index(&self, row: u32, column: u32) -> u32 {
        // times 3 sinces a cell contains 3 bytes
        self.snake_game.get_pixel_buffer_index(row, column)
    }
}

