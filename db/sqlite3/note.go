package sqlite3

import (
	"github.com/chadweimer/gomp/db/sqlcommon"
	"github.com/chadweimer/gomp/models"
	"github.com/jmoiron/sqlx"
)

type noteDriver struct {
	*sqlcommon.NoteDriver
}

func newNoteDriver(driver *driver) *noteDriver {
	return &noteDriver{
		NoteDriver: &sqlcommon.NoteDriver{Driver: driver.Driver},
	}
}

func (d *noteDriver) Create(note *models.Note) error {
	return d.Tx(func(tx *sqlx.Tx) error {
		return d.CreateTx(note, tx)
	})
}

func (d *noteDriver) CreateTx(note *models.Note, tx *sqlx.Tx) error {
	stmt := "INSERT INTO recipe_note (recipe_id, note) " +
		"VALUES ($1, $2)"

	res, err := tx.Exec(stmt, note.RecipeID, note.Note)
	if err != nil {
		return err
	}
	note.ID, _ = res.LastInsertId()

	return nil
}
