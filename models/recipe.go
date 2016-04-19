package models

import "database/sql"

// Recipe is the primary model class for recipe storage and retrieval
type Recipe struct {
	ID          int
	Name        string
	Description string
}

func GetRecipeByID(id int) (*Recipe, error) {
	db, err := OpenDatabase()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var name string
	var description string
	err = db.QueryRow("SELECT name, description FROM recipes WHERE id = $1", id).Scan(&name, &description)
	switch {
	case err == sql.ErrNoRows:
		return nil, nil
	case err != nil:
		return nil, err
	default:
		return &Recipe{ID: id, Name: name, Description: description}, nil
	}
}

func ListRecipes() ([]*Recipe, error) {
	db, err := OpenDatabase()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var recipes []*Recipe
	rows, err := db.Query("SELECT id, name FROM recipes")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var id int
		var name string
		var description string
		rows.Scan(&id, &name, &description)
		recipes = append(recipes, &Recipe{ID: id, Name: name, Description: description})
	}

	return recipes, nil
}
