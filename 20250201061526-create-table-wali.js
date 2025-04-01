'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('wali', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tempat_lahir: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      agama: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      kewarganegaraan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pendidikan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pekerjaan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pengeluaran_per_bulan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      alamat: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      no_telepon: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      status_perubahan: {
        type: Sequelize.ENUM('pending', 'approved'),
        allowNull: false,
        defaultValue: "approved"
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('wali')
  },
}