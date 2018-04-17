<?php

class Index extends AController
{
    private $model;

    public function __construct(){
        $this->model = new Model();
    }

    public function draw(){
        $steps = [];
        if ($_POST['action']){
            $steps = $this->model->generateSteps(
                $_POST['rows'],
                $_POST['column'],
                $_POST['count']
            );
        }
        return $steps;
    }

    public function get_body(){
        return $this->render('index',
            array(
                'title' => 'Игра Лабиринт'
            )
        );
    }


}