<?php

class Index extends AController
{
    private $model;

    public function __construct(){
        $this->model = new Model();
    }

    public function draw(){
        $steps = [];
        switch ($_POST['action']){
            case 'goRight':{
                $steps = $this->model->goRight(
                    $_POST['rows'],
                    $_POST['column'],
                    $_POST['count']
                );
                break;
            }
            case 'goLeft':{
                $steps = $this->model->goLeft(
                    $_POST['rows'],
                    $_POST['column'],
                    $_POST['count']
                );
                break;
            }
            case 'goUp':{
                $steps = $this->model->goUp(
                    $_POST['rows'],
                    $_POST['column'],
                    $_POST['count']
                );
                break;
            }
            case 'goDown':{
                $steps = $this->model->goDown(
                    $_POST['rows'],
                    $_POST['column'],
                    $_POST['count']
                );
                break;
            }
        }
        return end($steps);
    }

    public function get_body(){
        return $this->render('index',
            array(
                'title' => 'Игра Лабиринт'
            )
        );
    }


}