//initialise
let lives = 3;
let score = 0;
let game = document.getElementById("game");
let play_area = document.getElementById("play-area");
let play_again = document.getElementById("play-again");
let attack_div = document.getElementById("attack_div");

play_again.style.display = "none";

//some constants
let plane_vel = 5;
let attack_vel = 5;
let max_attack = 5;
let cloud_speed = 1;
let enemy_speed = 4;
let clouds_generate_speed = 3000;
let enemy_plane_generate_speed = 1500;

//player-plane specification
let player_plane = document.getElementById("player-plane");
player_plane.style.left = "0px";
player_plane.style.top = "0px";

//attacks specification
let attack = document.createElement('img');
attack.setAttribute("src", "./characters/attacks.png");
attack.className = "attack";

let current_attacks = [];

//user playing area specification
let play_area_height = play_area.clientHeight;
let play_area_width = play_area.clientWidth;

let player_plane_height = player_plane.clientHeight;
let player_plane_width = player_plane.clientWidth;

let attack_height = parseInt(document.getElementsByClassName("attack")[0].clientHeight);
let attack_width = parseInt(document.getElementsByClassName("attack")[0].clientWidth);
document.getElementsByClassName("attack")[0].remove();

let enemy_plane_height = parseInt(document.getElementsByClassName("enemy-plane")[0].clientHeight);
let enemy_plane_width = parseInt(document.getElementsByClassName("enemy-plane")[0].clientWidth);
document.getElementsByClassName("enemy-plane")[0].remove();

let stats_height = parseInt(document.getElementById("stats").clientHeight);

let cloud_height = parseInt(document.getElementsByClassName("cloud")[0].clientHeight);
let cloud_width = parseInt(document.getElementsByClassName("cloud")[0].clientWidth);
document.getElementsByClassName("cloud")[0].remove();

//players-plane movements
document.body.addEventListener("keydown", (e) => {
    e.preventDefault();

    if (e.keyCode == 38) {
        //up arrow key
        if (parseInt(player_plane.style.top) != 0) {
            player_plane.style.top = parseInt(player_plane.style.top) - plane_vel + 'px';
        }
    }
    if (e.keyCode == 40) {
        //down arrow key
        let valid_space = play_area_height - parseInt(player_plane_height)
        if (parseInt(player_plane.style.top) < valid_space)
            player_plane.style.top = parseInt(player_plane.style.top) + plane_vel + 'px';
    }
    if (e.keyCode == 37) {
        //left arrow key
        if (parseInt(player_plane.style.left) != 0) {
            player_plane.style.left = parseInt(player_plane.style.left) - plane_vel + 'px';
        }
    }
    if (e.keyCode == 39) {
        //right arrow key
        if (parseInt(player_plane.style.left) < play_area_width / 3) {
            player_plane.style.left = parseInt(player_plane.style.left) + plane_vel + 'px';
        }
    }
})

//projectile attacks
document.body.addEventListener("keydown", (e) => {
    e.preventDefault();

    if (e.keyCode == 32) {
        let x = parseInt(player_plane.style.left);
        let y = parseInt(player_plane.style.top) + parseInt(player_plane_width) / 2 - parseInt(attack_height) / 2;
        let new_attack = document.createElement("img");
        new_attack.setAttribute("src", "./characters/attacks.png");
        new_attack.className = "attack";
        new_attack.style.position = "relative";
        new_attack.style.top = y + "px";
        new_attack.style.left = x + "px";
        if (current_attacks.length != max_attack) {
            attack_div.prepend(new_attack);
            current_attacks.push(new_attack);

        }
    }
})

//clouds

let curr_clouds = [];

let clouds_generate = setInterval(async () => {
    let y_cor = Math.random() * (play_area_height);
    let node = document.createElement("img");
    node.setAttribute("src", "./characters/cloud.png");
    node.className = "cloud";
    node.style.position = "absolute";
    node.style.top = y_cor + stats_height + 'px';
    node.style.right = '0px';
    if ((parseInt(node.style.top) + cloud_height + 7) < (play_area_height + stats_height)) {
        play_area.append(node);
        curr_clouds.push(node);
    }
}, clouds_generate_speed)
function move_clouds() {
    for (let i = 0; i < curr_clouds.length; i++) {
        if (parseInt(curr_clouds[i].style.right) + cloud_width >= (play_area_width) * 0.98) {
            curr_clouds[i].remove();
            curr_clouds.shift();
            continue;
        }
        curr_clouds[i].style.right = parseInt(curr_clouds[i].style.right) + cloud_speed + 'px';
    }
}
//move attacks and collision
let game_running = setInterval(() => {
    move_clouds();
    move_attacks();
    move_enemy_planes();
    check_plane_collision();
    check_attack_collision();
}, 20);


function move_attacks() {
    for (let i = 0; i < current_attacks.length; i++) {
        if ((parseInt(current_attacks[i].style.left)) >= (play_area_width) * 0.75) {
            current_attacks[i].remove();
            current_attacks.shift();
            //shift to remove from array
            //remove to remove from html
            continue;
        }
        current_attacks[i].style.left = parseInt(current_attacks[i].style.left) + attack_vel + 'px';
    }
}
let curr_enemy_planes = [];

let enemy_plane_generate = setInterval(() => {
    let y_cor = Math.random() * (play_area_height);
    let node = document.createElement("img");
    node.setAttribute("src", "./characters/enemy_plane.png");
    node.className = "enemy-plane";
    node.style.position = "absolute";
    node.style.right = '0px';
    node.style.top = y_cor + stats_height + 'px';
    if ((parseInt(node.style.top) + enemy_plane_height + 7) < (play_area_height + stats_height)) {
        play_area.append(node);
        curr_enemy_planes.push(node);
    }
}, enemy_plane_generate_speed);

function move_enemy_planes() {
    for (let i = 0; i < curr_enemy_planes.length; i++) {
        if (parseInt(curr_enemy_planes[i].style.right) + enemy_plane_width >= (play_area_width) * 0.98) {
            curr_enemy_planes[i].remove();
            curr_enemy_planes.splice(i,1);
            continue;
        }
        curr_enemy_planes[i].style.right = parseInt(curr_enemy_planes[i].style.right) + enemy_speed + 'px';
    }
}
function check_attack_collision() {
    if (current_attacks.length > 0) {
        for (let j = 0; j < current_attacks.length; j++) {
            
        let attack_x = parseInt(current_attacks[j].style.left) + attack_width;
        let attack_y_min = parseInt(current_attacks[j].style.top);
        let attack_y_max = parseInt(current_attacks[j].style.top) + attack_height;
            for (let i = 0; i < curr_enemy_planes.length; i++) {
                if ((play_area_width - parseInt(curr_enemy_planes[i].style.right) - 2.5 * enemy_plane_width) <= attack_x) {
                    let enemy_y_min = parseInt(curr_enemy_planes[i].style.top);
                    let enemy_y_max = parseInt(curr_enemy_planes[i].style.top) + enemy_plane_height;
                    if ((attack_y_min >= enemy_y_min && attack_y_min <= enemy_y_max) || (attack_y_max >= enemy_y_min && attack_y_max <= enemy_y_max)) {
                        score++;
                        document.getElementById("score").innerHTML = score;
                        curr_enemy_planes[i].remove();
                        curr_enemy_planes.splice(i,1);
                        current_attacks[j].remove();
                        current_attacks.splice(j,1);
                    }
                }
            }
        }
    }
}
function check_plane_collision() {
    let player_x = parseInt(player_plane.style.left) + player_plane_width;
    let player_y_min = parseInt(player_plane.style.top);
    let player_y_max = parseInt(player_plane.style.top) + player_plane_height;
    for (let i = 0; i < curr_enemy_planes.length; i++) {
        if (((play_area_width - parseInt(curr_enemy_planes[i].style.right) - enemy_plane_width) >= parseInt(player_plane.style.left))
            && (play_area_width - parseInt(curr_enemy_planes[i].style.right) - enemy_plane_width) <= player_x) {
            let enemy_y_min = parseInt(curr_enemy_planes[i].style.top);
            let enemy_y_max = parseInt(curr_enemy_planes[i].style.top) + enemy_plane_height;
            if ((player_y_min >= enemy_y_min && player_y_min <= enemy_y_max) || (player_y_max >= enemy_y_min && player_y_max <= enemy_y_max)) {
                lives--;
                document.getElementById("lives").innerHTML = lives;
                curr_enemy_planes[i].remove();
                curr_enemy_planes.splice(i,1);
                if (lives == 0) {
                    game_over();
                }
            }
        }
    }
}
function game_over() {
    clearInterval(clouds_generate);
    clearInterval(enemy_plane_generate);
    clearInterval(game_running);
    play_again.style.display = "grid";
}

