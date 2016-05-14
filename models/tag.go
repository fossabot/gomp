package models

import "database/sql"

type Tag string

type Tags []Tag

func (tag *Tag) Create(recipeID int64) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	err = tag.CreateTx(tx, recipeID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (tag *Tag) CreateTx(tx *sql.Tx, recipeID int64) error {
	_, err := tx.Exec(
		"INSERT INTO recipe_tag (recipe_id, tag) VALUES (?, ?)",
		recipeID, string(*tag))
	return err
}

func (tags *Tags) DeleteAll(recipeID int64) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	err = tags.DeleteAllTx(tx, recipeID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (tags *Tags) DeleteAllTx(tx *sql.Tx, recipeID int64) error {
	_, err := tx.Exec(
		"DELETE FROM recipe_tag WHERE recipe_id = ?",
		recipeID)
	return err
}

func (tags *Tags) List(recipeID int64) error {
	rows, err := db.Query(
		"SELECT tag FROM recipe_tag WHERE recipe_id = ?",
		recipeID)
	if err != nil {
		return err
	}

	for rows.Next() {
		var tag string
		err = rows.Scan(&tag)
		if err != nil {
			return err
		}
		*tags = append(*tags, Tag(tag))
	}

	return nil
}