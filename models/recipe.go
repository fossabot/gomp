package models

import "database/sql"

// Recipe is the primary model class for recipe storage and retrieval
type Recipe struct {
	ID          int64
	Name        string
	Description string
	Directions  string
}

func GetRecipeByID(id int64) (*Recipe, error) {
	db, err := OpenDatabase()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var name string
	var description string
	var directions string
	err = db.QueryRow("SELECT name, description, directions FROM recipes WHERE id = $1", id).Scan(&name, &description, &directions)
	switch {
	case err == sql.ErrNoRows:
		return nil, nil
	case err != nil:
		return nil, err
	default:
		return &Recipe{ID: id, Name: name, Description: description, Directions: directions}, nil
	}
}

func ListRecipes() ([]*Recipe, error) {
	db, err := OpenDatabase()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var recipes []*Recipe
	rows, err := db.Query("SELECT id, name, description, directions FROM recipes")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var id int64
		var name string
		var description string
		var directions string
		rows.Scan(&id, &name, &description, &directions)
		recipes = append(recipes, &Recipe{ID: id, Name: name, Description: description, Directions: directions})
	}

	return recipes, nil
}

func CreateRecipe(name string, description string, directions string) (*Recipe, error) {
	db, err := OpenDatabase()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	result, err := db.Exec("INSERT INTO recipes (name, description, directions) VALUES ($1, $2, $3)", name, description, directions)
	if err != nil {
		return nil, err
	}
	id, err := result.LastInsertId()

	return &Recipe{ID: id, Name: name, Description: description}, nil
}

func UpdateRecipe(r *Recipe) error {
	db, err := OpenDatabase()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("UPDATE recipes SET name = $1, description = $2, directions = $3 WHERE id = $4", r.Name, r.Description, r.Directions, r.ID)
	return err
}

func DeleteRecipe(id int64) error {
	db, err := OpenDatabase()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM recipes WHERE id = $1", id)
	return err
}
